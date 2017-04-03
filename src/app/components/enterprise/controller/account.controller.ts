import {EnterpriseService} from '../../enterprise/service/enterprise.service';

export class AccountController {
    public  companyId: string;
    public accountStatus: any = [];
    public accountIndex: number = 1;
    public changeTabLoading: boolean = false;
    public accounts: any = [];
    public loading: boolean = false;
    public itemsByPage: number = 5;
    public accountLoading: boolean = false;

    public filter: {
        limit: number;
        page: number;

    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1
    };

    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private $location: ng.ILocationService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $timeout: angular.ITimeoutService,
                private enterpriseService: EnterpriseService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get('company');

        vm.accountStatus = [
            {
                id: 1,
                name: vm.$translate.instant('account.recharge_record')
            },
            {
                id: 2,
                name: vm.$translate.instant('account.expenses_record')
            }
        ];

       vm.accountTab(1);



    }

    accountTab(id: number) {
        var vm = this;
        vm.accountIndex = id;
        vm.changeTabLoading = true;
        vm.accounts = [];
        switch(id) {
            case 1:
                vm.accountLoading = true;
                break;
            case 2:
                vm.accountLoading = false;
                break;
        }
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    callServer(tableState?: any) {
        var vm = this['$parent']['accountCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }
        vm.loading = true;
        if(vm.accountLoading) {
            vm.enterpriseService.getAccount({}, {cache: false}).then(function(result: any) {
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
                }, 100);

            });
        } else {
            vm.accounts = [];
            vm.$timeout(function () {
                vm.loading = false;
            }, 100);
        }

    }


}





