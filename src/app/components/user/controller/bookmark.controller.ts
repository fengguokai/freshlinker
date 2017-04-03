import {MetaService} from '../../../main/meta.service';
import {BookmarkService, IBookmark} from '../../position/service/bookmark.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IUser} from '../../user/service/user.service';
import {PositionService, IPosition} from '../../position/service/position.service';

export class BookmarkController {
    public positions: IPosition[] = [];
    public tableLoading: boolean = false;
    public itemsByPage: number = 10;

    public changeLoading: boolean = false;
    public positionLoading: boolean = false;

    // bookmark

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
    constructor(private toaster: ngtoaster.IToasterService,
                private $location: ng.ILocationService,
                private $state: ng.ui.IStateService,
                private $timeout: any,
                private MetaService: MetaService,
                private $scope: ng.IScope,
                private bookmarkService: BookmarkService,
                private dashboardTabsService: DashboardTabsService,
                private $translate: angular.translate.ITranslateService,
                private user: IUser,
                private positionService: PositionService) {
        var vm = this;
        MetaService.pageTitle = vm.$translate.instant('user.profile.bookmark');
        vm.dashboardTabsService.set("position");
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



    callServer(tableState?: any) {
        var vm = this['$parent']['bookmarkCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }
        vm.tableLoading = true;
        vm.bookmarkService.get(params, {cache: false}).then(function (result: IBookmark[]) {
            if (result.length !== 0) {
                _.each(result, function(value: any) {
                    if(value.position.active) {
                        vm.positionService.find(value.positionId, {cache: false}).then(function(result: any) {
                            result.bookmarkStatus = true;
                            vm.positions.push(result);
                        });

                    }
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
                vm.tableLoading = false;
                vm.positionLoading = false;
            }, 100);

        });
    }

    // remove save position
    removeCollectPosition( positionId: string) {
        var vm = this;
        vm.bookmarkService.destroy(positionId).then(function (result: any) {
            var index = _.findIndex(vm.positions, {id: positionId});
            if(index !== -1) vm.positions[index].bookmarkStatus = false;
            vm.toaster.pop('success', '', vm.$translate.instant('message.user_collect_position_remove_success_msg'));
        });

    }

    collectPosition(positionId: string) {
        var vm = this;
        var index = _.findIndex(vm.positions, {id: positionId});
        vm.bookmarkService.store(positionId).then(function(result: any) {
            if(index !== -1) vm.positions[index].bookmarkStatus = true;
            vm.toaster.pop('success', '', vm.$translate.instant('message.user_collect_position_success_msg'));
        });
    }


}