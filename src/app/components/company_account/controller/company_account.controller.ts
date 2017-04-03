import {CompanyAccountService, IAccount} from '../service/company_account.service';
import {MetaService} from '../../../main/meta.service';

export class CompanyAccountController {
    public  companyId: string;
    public tableLoading: boolean = false;
    public changeTabLoading: boolean = false;
    public accounts: any = [];
    public loading: boolean = false;
    public itemsByPage: number = 5;
    public accountLoading: boolean = false;

    public filter: IAccount = {};
    public params: IAccount = {};


    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private $location: ng.ILocationService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $timeout: angular.ITimeoutService,
                private companyAccountService: CompanyAccountService,
                private MetaService: MetaService) {
        var vm = this;
        MetaService.pageTitle = vm.$translate.instant('enterprise.view_billing');
        vm.companyId = vm.localStorageService.get('company');
        vm.filter.page = parseInt(vm.$location.search().page) || 1;
        vm.filter.limit = vm.itemsByPage;
        vm.accountTab();
    }

    accountTab() {
        var vm = this;
        vm.accounts = [];
        vm.changeTabLoading = true;
        vm.accountLoading = true;
        vm.filter.page = parseInt(vm.$location.search().page) || 1;
        vm.filter.limit = vm.itemsByPage;
        delete vm.filter.startedDate;
        delete vm.filter.endedDate;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    searchAccount() {
        var vm = this;
        vm.accounts = [];
        vm.changeTabLoading = true;
        vm.accountLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    callServer(tableState?: any) {
        var vm = this['$parent']['accountCtrl'];
        if(!_.isUndefined(vm.filter.startedDate) && !_.isUndefined(vm.filter.endedDate)) {
            if (vm.filter.startedDate > vm.filter.endedDate) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.date_add_error_msg'));
            } else {
                vm.params.startedDate = moment(vm.filter.startedDate).format('YYYY-MM-DD');
                vm.params.endedDate = moment(vm.filter.endedDate).format('YYYY-MM-DD');
            }
        }
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            vm.params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            vm.params.page = pagination.next;
        }
        vm.loading = true;
            vm.companyAccountService.getAccount(vm.params, {cache: false}).then(function(result: any) {
                if (result.length !== 0) {
                    vm.accounts = result;
                    _.each(vm.accounts, function(val: any) {
                        switch(val.paid) {
                            case true:
                                val.paid = vm.$translate.instant('message.credit_card_recharge_success');
                                break;
                            default:
                                val.paid = vm.$translate.instant('message.credit_card_recharge_failed');
                                break;
                        }
                        val.created = moment.unix(val.created).format('YYYY-MM-DD');
                    });
                }
                if (result.length < vm.filter.limit) {
                    tableState['pagination']['next'] = null;
                    tableState['pagination']['prev'] = null;
                } else {
                    tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
                    tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
                    if (result.length !== 0) {
                        vm.$location.search('page', result['meta']['pagination']['currentPage']);
                    }
                }

                vm.$timeout(function () {
                    vm.loading = false;
                    vm.accountLoading = false;
                }, 100);

            });


    }




}





