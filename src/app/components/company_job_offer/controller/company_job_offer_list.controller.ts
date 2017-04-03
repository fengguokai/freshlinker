import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IJobOffer, JobOfferService} from '../../company_job_offer/service/company_job_offer.service';


export class JobOfferListController {
    public jobOffer: any = {};
    public types: any = {};
    public companyId: string;

    public itemsByPage: number = 5;

    public jobOffers: IJobOffer[] = [];

    public tableLoading: boolean = false;

    public educationName: string;

    public jobOfferLoading: boolean = false;

    public changeTabLoading: boolean = false;



    // Candidate

    public filter: {
        limit: number;
        page: number;
        search?: string;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        search: ''
    };



    /* @ngInject */
    constructor(private breadcrumbService: BreadcrumbService,
                private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private jobOfferService: JobOfferService,
                private toaster: ngtoaster.IToasterService,
                private localStorageService: any,
                private jobOfferService: JobOfferService,
                private $location: ng.ILocationService,
                private $timeout: any,
                private $state: any) {
        var vm = this;
        vm.dashboardTabsService.set('job_offer');
        MetaService.pageTitle = vm.$translate.instant('enterprise.position_offer');
        vm.companyId = vm.localStorageService.get('company');
        vm.changeTab();


    }

    changeTab() {
        var vm = this;
        vm.jobOffers = [];
        vm.filter.search = '';
        vm.changeTabLoading = true;
        vm.jobOfferLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    searchJobOffer() {
        var vm = this;
        vm.jobOffers = [];
        vm.jobOfferLoading = true;
        vm.changeTabLoading = true;

        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    changeSearch() {
        var vm = this;
        vm.$timeout(function() {
            if(vm.filter.search === undefined) vm.searchJobOffer();
        }, 3000);
    }

    callServer(tableState: any) {
        var vm = this['$parent']['jobOfferListCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];

        vm.tableLoading = true;
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }

        var keys = ['limit', 'page', 'search'];
        _.each(keys, function (value: string, index: number) {
            if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
                delete params[value];
            }
        });

        vm.jobOfferService.get(vm.companyId ,params, {cache: false}).then(function (result: any) {
            if (result.length !== 0) {
                vm.jobOffers = result;
                _.each(vm.jobOffers, function(value: any) {
                    vm.jobOfferService.getInviteNum(value.companyId, value.id, {}, {cache: false}).then(function(result: any) {
                        value['inviteNum'] = result.count;
                    });
                });
            }
            if (result.length === 0) {
                tableState['pagination']['next'] = null;
                tableState['pagination']['prev'] = null;
            } else {
                tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
                tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
                vm.$location.search('page', result['meta']['pagination']['currentPage']);
            }

            vm.$timeout(function () {
                vm.tableLoading = false;
                vm.jobOfferLoading = false;
            }, 500);
        });

    }

    deleteJobOffer(index: number) {
        var vm = this;
        vm.jobOfferService.destroy(vm.companyId, vm.jobOffers[index].id).then(function(result: any) {
            vm.jobOffers.splice(index, 1);
            vm.toaster.pop('success', '', vm.$translate.instant('message.delete_success_msg'));
        });

    }



}



