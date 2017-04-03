import {ICandidate, CandidatePositionService} from  '../service/company_interview.service';
import{ICountry,CountryService} from '../../company/service/country.service';
import {ICompany, CompanyService} from '../../company/service/company.service';
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IUser, UserService} from '../../user/service/user.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';

export class CompanyInterviewListController {
    public company: ICompany;
    public country: ICountry;
    public itemsByPage: number = 10;
    public interviewIndex: number = 1;


    // Candidate

    public filter: {
        limit: number;
        page: number;
        candidateStatusId: number;
        search?: string;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        candidateStatusId: 1,
        search: ''
    };


    public candidateStatus: any[];
    public changeTabLoading: boolean = false;
    public candidates: any = [];
    public tableLoading: boolean = false;

    public candidateLoading: boolean = false;

    public companyId: string;

    public candidateNum: number = 0;
    public positionName: string[] = [];
    /* @ngInject */
    constructor(private candidatePositionService: CandidatePositionService,
                private $location: ng.ILocationService,
                private toaster: ngtoaster.IToasterService,
                private $state: ng.ui.IStateService,
                private $translate: angular.translate.ITranslateService,
                private $timeout: angular.ITimeoutService,
                private MetaService: MetaService,
                private localStorageService: any,
                private dashboardTabsService: DashboardTabsService,
                private userService: UserService,
                private breadcrumbService: BreadcrumbService) {

        var vm = this;
        vm.dashboardTabsService.set('interview');
        // set breadcrumb
        vm.breadcrumbService.clear();
        vm.breadcrumbService.set({title: vm.$translate.instant('enterprise.enterprise'), url:'/company/dashboard'});
        vm.breadcrumbService.set({title: vm.$translate.instant('enterprise.resume_management')});
        // get data
        vm.candidateStatus = [
            {
                id: 1,
                name: 'company.untreated_resume'
            },
            {
                id: 2,
                name: 'company.communication_resume'
            },
            {
                id: 5,
                name: 'company.success_resume'
            },
            {
                id: 4,
                name: 'company.finish_resume'
            },
            {
                id: 3,
                name: 'company.improper_resume'
            }
        ];

        MetaService.pageTitle = vm.$translate.instant('enterprise.resume_management');
        vm.companyId = vm.localStorageService.get('company');
        vm.candidatePositionService.get(vm.localStorageService.get('company'), {}, {cache: false}).then(function (result: Array<ICandidate>) {
            vm.candidateNum = result.length;
        });
        vm.changeTab(1);
    }

    changeTab(id: number) {
        var vm = this;
        vm.filter.candidateStatusId = id;
        vm.interviewIndex = id;
        vm.candidates = [];
        vm.filter.search = '';
        vm.changeTabLoading = true;
        vm.candidateLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    searchInterview() {
        var vm = this;
        vm.candidates = [];
        vm.changeTabLoading = true;
        vm.candidateLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    callServer(tableState: any) {
        var vm = this['$parent']['interviewCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];

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


        vm.tableLoading = true;
        vm.candidatePositionService.get(vm.localStorageService.get('company'), params, {cache: false}).then(function (result: Array<ICandidate>) {
            if (result.length !== 0) {
                    _.each(result, function(value: any) {
                        var index = _.findIndex(vm.candidates, {name: value.position.name});
                        if(index === -1) {
                            vm.candidates.push({name: value.position.name, content: value});
                        } else {
                            if(!_.isArray(vm.candidates[index].content)) vm.candidates[index].content = [vm.candidates[index].content];
                            var item = _.findIndex(vm.candidates[index].content, {userId: value.userId});
                            if(item === -1) vm.candidates[index].content.push( value);
                        }
                    });
                _.each(vm.candidates, function(val:any) {
                    if(!_.isArray(val.content)) val.content = [val.content];
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
                vm.candidateLoading = false;
            }, 100);
        });
    }

    // interview && notSuitableInterview
    changeInterviewStatus(id: string, interviewStatus: number) {
        var vm = this;
        vm.candidatePositionService.update(vm.localStorageService.get('company'), id, {candidateStatusId: interviewStatus}).then(function (result: ICandidate) {
            switch (vm.filter.candidateStatusId) {
                case 1:
                    vm.changeTab(1);
                    break;
                case 2:
                    vm.changeTab(2);
                    break;
                case 3:
                    vm.changeTab(3);
                    break;
                case 4:
                    vm.changeTab(4);
                    break;
                case 5:
                    vm.changeTab(5);
                    break;
            }
            vm.toaster.pop('success', '', vm.$translate.instant('message.resume_success_msg'));
        }, function () {
            vm.toaster.pop('error', '', vm.$translate.instant('message.resume_error_msg'));
        });
    }


}
