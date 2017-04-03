import {CompanyConsumeService} from '../../company_consume/service/company_consume.service';
import {IAccount} from '../../company_account/service/company_account.service';

export class CompanyConsumeController {
    public  companyId: string;
    public accountStatus: any = [];
    public accountIndex: number = 1;
    public tableLoading: boolean = false;
    public changeTabLoading: boolean = false;
    public consumes: any = [];
    public loading: boolean = false;
    public itemsByPage: number = 5;
    public consumeLoading: boolean = false;

    public filter: IAccount = {};
    public params: IAccount = {};


    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private $location: ng.ILocationService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $timeout: angular.ITimeoutService,
                private companyConsumeService: CompanyConsumeService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get('company');
        vm.change();
    }

    change() {
        var vm = this;
        vm.consumes = [];
        vm.changeTabLoading = true;
        vm.consumeLoading = true;
        vm.filter.page = parseInt(vm.$location.search().page) || 1;
        vm.filter.limit = vm.itemsByPage;
        delete vm.filter.startedDate;
        delete vm.filter.endedDate;
        vm.$timeout(function() {
            vm.changeTabLoading = false;
        }, 1);

    }

    searchConsume() {
        var vm = this;
        vm.consumes = [];
        vm.changeTabLoading = true;
        vm.consumeLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }
   

    callServer(tableState?: any) {
        var vm = this['$parent']['consumeCtrl'];
        vm.loading = true;

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

            vm.companyConsumeService.get(vm.params, {cache: false}).then(function(result: any) {
                if (result.length > 0) {
                    vm.consumes = result;
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
                    vm.consumeLoading = false;
                }, 100);

            }, function() {
                vm.loading = false;
                vm.consumeLoading = false;
                vm.consumes = [];
            });
        

    }
}





