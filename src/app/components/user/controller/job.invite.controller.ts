import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {IUser} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';
import { IUser, IUpload, UserService} from '../service/user.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {AuthService} from '../../auth/service/auth.service';
import {CheckApplyPositionController} from '../../position/controller/position.check.apply.controller';
import {PositionService} from '../../position/service/position.service';
import {CandidateService} from '../../position/service/candidate.service';
import {PositionService, IPosition} from '../../position/service/position.service';


export class JobInviteController {
    public tableLoading: boolean = false;
    public itemsByPage: number = 10;
    public positions: any = [];

    public inviteStatus: any[] = [];

    public inviteIndex: number = 1;

    public changeTabLoading: boolean = false;

    public positionLoading: boolean = false;

    public fliter: {
        limit: number;
        page: number;
        status: string;
        search?: string;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        status: null,
        search: ''
    };

    public isApplied: boolean = false;

    public similarPositions: IPosition[] = [];

    public loading: boolean = false;

    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private userService: UserService,
                private $location: ng.ILocationService,
                private $timeout: angular.ITimeoutService,
                private positionService: PositionService,
                private candidateService: CandidateService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private toaster: ngtoaster.IToasterService,
                private positionService: PositionService) {
        var vm = this;

        MetaService.pageTitle = vm.$translate.instant('user.profile.job_invite');
        vm.dashboardTabsService.set("job_invite");
        vm.tableLoading = false;


        vm.loading = true;
        vm.positionService.get({}, {cache: false}).then(function(result: IPosition[]) {
            vm.similarPositions = result;
            vm.loading = false;
        });

        vm.inviteStatus = [
            {
                id: 1,
                name: 'position.untreated_post',
                status: 'pending'
            },
            {
                id: 2,
                name: 'position.accepted_post',
                status: 'accepted'
            },
            {
                id: 3,
                name: 'position.rejected_post',
                status: 'rejected'
            }
        ];

        vm.inviteTab(1);

    }

    inviteTab(id: number) {
        var vm = this;
        vm.inviteIndex = id;
        vm.changeTabLoading = true;
        vm.positions = [];
        vm.positionLoading = true;
        vm.fliter.search = '';
        switch(id) {
            case 1:
                vm.fliter.status = 'pending';
                break;
            case 2:
                vm.fliter.status = 'accepted';
                break;
            case 3:
                vm.fliter.status = 'rejected';
                break;
        }
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    searchPosition() {
        var vm = this;
        vm.changeTabLoading = true;
        vm.positions = [];
        vm.positionLoading = true;
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }


    // get positions
    callPositionServer(tableState: any) {
        var vm = this['$parent']['inviteCtrl'];
        var params = angular.copy(vm.fliter);
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }

        vm.tableLoading = true;
        var keys = ['limit', 'page'];
        _.each(keys, function (value: string, index: number) {
            if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
                delete params[value];
            }
        });

        vm.userService.getPositionInvitations(params, {cache: false}).then(function (result: any) {
            if (result.length !== 0) {
                _.each(result, function(value:any) {
                    if(value.position.active) {
                        vm.userService.getCandidates({positionId: value.position.id}, {cache: false}).then(function(result: any) {
                            value['candidateNum'] = result.length;
                        });
                        vm.positions.push(value);
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

    // position candidate
    setCandidate(positionId: string, invitationId: string): void {
        var vm = this;
        var index = _.findIndex(vm.positions, {id: invitationId});
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/position/template/applyPositionMessage.html',
            controller: CheckApplyPositionController,
            controllerAs: 'positionCheckApplyCtrl',
            resolve: {
                /* @ngInject */
                position: function(positionService: PositionService) {
                    return vm.positionService.find(positionId, {}, {cache:false});
                }

            }
        });
        modalInstance.result.then(function (result: any) {
            if (result.isCheckApply) {
                if(result.positionAnswer.length > 0) {
                    vm.candidateService.userApplyPosition(invitationId, {
                        question: result.positionAnswer,
                        positionId: positionId
                    }).then(function (result: any) {
                        if(index !== -1) vm.positions[index].status = 'accepted';
                        vm.inviteTab(1);
                        vm.toaster.pop('success', '', vm.$translate.instant('message.posted_success_msg'));
                    }, function (result: any) {
                        vm.toaster.pop('error', '', vm.$translate.instant('message.posted_error_msg'));
                    });
                } else {
                    vm.candidateService.userApplyPosition(invitationId, {positionId: positionId}).then(function (result: any) {
                        if(index !== -1) vm.positions[index].status = 'accepted';
                        vm.inviteTab(1);
                        vm.toaster.pop('success', '', vm.$translate.instant('message.posted_success_msg'));
                    }, function (result: any) {
                        vm.toaster.pop('error', '', vm.$translate.instant('message.posted_error_msg'));
                    });
                }


            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

    rejectPositionInvite(id: string) {
        var vm = this;
        var index = _.findIndex(vm.positions, {id: id});
        vm.candidateService.rejectPositionInvite(id, {}, {cache: false}).then(function(result: any) {
            if(index !== -1) vm.positions[index].status = 'rejected';
            vm.inviteTab(1);
        });
    }


}
