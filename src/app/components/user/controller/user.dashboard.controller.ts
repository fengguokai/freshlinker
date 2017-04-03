import {IUser, UserService} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';
import { IUser, IUpload, UserService} from '../service/user.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {PositionService, IPosition} from '../../position/service/position.service';
import {UserArticleService, IArticle} from '../../user_article/service/user.article.service';
import {ProfileFormIconController} from './profile.icon.controller';
import {CandidateService} from '../../position/service/candidate.service';
import {CheckApplyPositionController} from '../../position/controller/position.check.apply.controller';


export class UserDashboardController {
    public user: IUser = {};
    public loading: boolean = false;

    public appliedPositionLoading: boolean = false;
    public appliedPositions: IPosition[] = [];

    public invitationPositonLoading: boolean = false;
    public invitationPositons: IPosition[] = [];

    public articleLoading: boolean = false;
    public articles: IArticle[] = [];

    public positionLoading: boolean = false;

    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private positionService: PositionService,
                private userService: UserService,
                private userArticleService: UserArticleService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private candidateService: CandidateService,
                private toaster: ngtoaster.IToasterService,
                private $timeout: any) {
        var vm = this;

        MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile');
        vm.dashboardTabsService.set("dashboard");

        vm.change();
        vm.invitationPositonLoading = true;
        vm.userService.getPositionInvitations({'limit': 3}, {cache: false}).then(function (result: IPosition[]) {
            if (result.length !== 0) {
                _.each(result, function(value:any) {
                    if(value.position.active) {
                        vm.userService.getCandidates({positionId: value.position.id}, {cache: false}).then(function(result: any) {
                            value['candidateNum'] = result.length;
                        });
                        vm.invitationPositons.push(value);
                    }
                });
            }
            vm.invitationPositonLoading = false;
        });

        vm.articleLoading = true;
        vm.userArticleService.get({'limit': 3}, {cache: false}).then(function (result: IArticle[]) {
            vm.articles = result;
            vm.articleLoading = false;
        });
    }

    change() {
        var vm = this;
        // get user
        vm.loading = true;
        vm.positionLoading = true;
        vm.appliedPositionLoading = true;
        vm.appliedPositions = [];
        vm.userService.find({}, {cache: false}).then(function(result: IUser) {
            vm.user = result;
            vm.positionService.getByUserAppliedPosition({'limit': 3, 'userId': vm.user.id}, {cache: false}).then(function (result: IPosition[]) {
                if(result.length > 0) {
                    _.each(result, function (value: any) {
                        value['candidateNum'] = 0;
                        var index = _.findIndex(vm.appliedPositions, {positionId: value.positionId});
                        if (value.position.active) {
                            switch (value.candidateStatus.name) {
                                case 'unprocessed':
                                    value.candidateStatus.name = 'position.unprocessed';
                                    break;
                                case 'shortlist':
                                    value.candidateStatus.name = 'position.shortlist';
                                    break;
                                case 'not-suitable':
                                    value.candidateStatus.name = 'position.not-suitable';
                                    break;
                                case 'complete':
                                    value.candidateStatus.name = 'position.complete';
                                    break;
                                case 'success':
                                    value.candidateStatus.name = 'position.success';
                                    break;
                            }
                            vm.positionService.getByUserAppliedPositionCandidateNum({'positionId': value.positionId}, {cache: false}).then(function(result: IPosition[]) {
                                value['candidateNum'] = result.length;
                            }).then(function() {
                                if(index === -1) vm.appliedPositions.push(value);
                                vm.$timeout(function() {
                                    vm.appliedPositionLoading = false;
                                    vm.positionLoading = false;
                                }, 500);

                            });

                        }
                    });
                } else {
                    vm.appliedPositionLoading = false;
                    vm.positionLoading = false;
                }


            });
            vm.loading = false;
        });
    }

    // position invite
    // position candidate
    setCandidate(positionId: string, invitationId: string): void {
        var vm = this;
        var index = _.findIndex(vm.invitationPositons, {id: invitationId});
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
                        if(index !== -1) vm.invitationPositons[index].status = 'accepted';
                        vm.toaster.pop('success', '', vm.$translate.instant('message.posted_success_msg'));
                    }, function (result: any) {
                        vm.toaster.pop('error', '', vm.$translate.instant('message.posted_error_msg'));
                    });
                } else {
                    vm.candidateService.userApplyPosition(invitationId, {positionId: positionId}).then(function (result: any) {
                        if(index !== -1) vm.invitationPositons[index].status = 'accepted';
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
        var index = _.findIndex(vm.invitationPositons, {id: id});
        vm.candidateService.rejectPositionInvite(id, {}, {cache: false}).then(function(result: any) {
            if(index !== -1) vm.invitationPositons[index].status = 'rejected';
        });
    }


    destory(id: string) {
        var vm = this;
        vm.articleLoading = true;
        vm.userArticleService.destroy(id).then(function (result: any) {
            var index = _.findIndex(vm.articles, {id: id});
            if (index !== -1) vm.articles.splice(index, 1);
            vm.articleLoading = false;
        });
    }



    // get or store user icon
    openEditIconDialog(icon: any): void {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/user/template/profile.icon.form.html',
            controller: ProfileFormIconController,
            controllerAs: 'iconCtrl',
            resolve: {
                /* @ngInject */
                icon: function () {
                    return icon;
                }
            }
        });
        modalInstance.result.then(function (result: any) {
            if(!_.isUndefined(result)) {
                vm.user.icon = result;
            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

}
