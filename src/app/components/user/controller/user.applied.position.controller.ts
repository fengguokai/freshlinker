import {IUser, UserService} from '../service/user.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {MetaService} from '../../../main/meta.service';
import {PositionService, IPosition} from '../../position/service/position.service';
import {BookmarkService, IBookmark} from '../../position/service/bookmark.service';


export class UserPositionController {

    public positions: IPosition[] = [];
    public tableLoading: boolean = false;
    public itemsByPage: number = 10;

    public changeLoading: boolean = false;
    public positionLoading: boolean = false;



    public filter: {
        limit: number;
        page: number;
        userId: string;
        search?: string;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        userId: null,
        search: ''
    };


    /* @ngInject */
    constructor(private user: IUser,
                private dashboardTabsService: DashboardTabsService,
                private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private $location: ng.ILocationService,
                private positionService: PositionService,
                private $timeout: angular.ITimeoutService,
                private bookmarkService: BookmarkService,
                private toaster: ngtoaster.IToasterService) {
        //
        var vm = this;
        vm.dashboardTabsService.set("position");
        MetaService.pageTitle = vm.$translate.instant('user.profile.applied_position');

        vm.filter.userId = vm.user.id;
        vm.changeTab();

    }


    changeTab() {
        var vm = this;
        vm.changeLoading = true;
        vm.positions = [];
        vm.positionLoading = true;
        vm.filter.search = '';
        vm.$timeout(function() {
            vm.changeLoading = false;
        }, 1);

    }

    searchPosition() {
        var vm = this;
        vm.positions = [];
        vm.changeLoading = true;
        vm.positionLoading = true;
        vm.$timeout(function() {
            vm.changeLoading = false;
        }, 1);
    }


    // get user applied position
    callPositionServer(tableState?: any) {
        var vm = this['$parent']['userPositionCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }


        var keys = ['limit', 'page'];
        _.each(keys, function (value: string, index: number) {
            if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
                delete params[value];
            }
        });

        vm.tableLoading = true;
        vm.positionService.getByUserAppliedPosition(params, {cache: false}).then(function (result: IPosition[]) {
            if (result.length !== 0) {
                _.each(result, function(value: any) {
                    var index = _.findIndex(vm.positions, {id: value.id});
                    if(value.position.active) {
                        if(index === -1) {
                            switch(value.candidateStatus.name) {
                                case 'unprocessed':
                                    value.candidateStatus.name = 'position.unprocessed';
                                    break;
                                case 'shortlist':
                                    value.candidateStatus.name = 'company.communication_resume';
                                    break;
                                case 'not-suitable':
                                    value.candidateStatus.name = 'position.not-suitable';
                                    break;
                                case 'complete':
                                    value.candidateStatus.name ='position.complete';
                                    break;
                                case 'success':
                                    value.candidateStatus.name = 'position.success';
                                    break;
                            }
                            vm.positions.push(value);
                        }
                    }
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
                vm.positionLoading = false;
            }, 100);
        });



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
                    _.each(value.filter, function(value: any) {
                        switch (value.type) {
                            case 'education':
                                value.type = vm.$translate.instant('user.profile.education');
                                switch (value.educationLevelId) {
                                    case 1:
                                        value['educationLevel'] = 'Master';
                                        break;
                                    case 2:
                                        value['educationLevel'] = 'Post Graduate';
                                        break;
                                    case 3:
                                        value['educationLevel'] = 'Degree';
                                        break;
                                    case 4:
                                        value['educationLevel'] = 'College';
                                        break;
                                    case 5:
                                        value['educationLevel'] = 'School Certificate';
                                        break;
                                    case 6:
                                        value['educationLevel'] = 'Any';
                                        break;

                                }
                                break;
                            case 'skill':
                                value.type = vm.$translate.instant('user.profile.skill');
                                value.name = value.value;
                                break;
                            case 'languages':
                                value.type = vm.$translate.instant('user.profile.language');
                                break;

                        }
                    })
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



}
