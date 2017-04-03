import { IPosition, PositionService} from '../service/position.service';
import {IUser, UserService} from '../../user/service/user.service';
import {AuthService} from '../../auth/service/auth.service';
import {CandidateService} from '../service/candidate.service';
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {IPositionCategory, PositionCategoryService} from '../../position_category/service/position_category.service';
import {CheckApplyPositionController} from '../controller/position.check.apply.controller';
import {BookmarkService, IBookmark} from '../service/bookmark.service';
import {RemoveSavePositionController} from '../controller/remove.save.position.controller';
import {ArticleService, IArticle} from '../../article/service/article.service';

export class PositionController {
    public positions: IPosition[] = [];
    public firstPosition: IPosition;
    public otherPosition: IPosition[];
    public isApplied: boolean = false;
    public user: IUser;
    public tableLoading: boolean = false;
    public itemsByPage: number = 10;

    public positionLoading: boolean = false;



    public pageNum: {
        limit: number;
        page: number;
    } = {
        limit: 5,
        page: 0
    };

    public search: string;
    public categoryIds: any = [];
    public companyId: number;
    public positionCategoryName: IPositionCategory[] = [];
    public minSalary: string;
    public maxSalary: string;
    public educationLevel: any = [];
    public experience: string;
    public positionMore: boolean;

    public  candidateNum: number = 0;

    //educationChart
    public educationChartLabels: any = [];
    public educationChartData: any = [];

    //experienceChart
    public experienceChartLabels: any = [];
    public experienceChartData: any = [];

    public educationChartLoading: boolean = false;
    public experienceChartLoading: boolean = false;


    // bookmark
    public bookmark: IBookmark[] = [];
    public bookmarkStatus: boolean = false;

    public question: any = [];

    // tab
    public positionTab: any = [];
    public positionIndex: number = 1;
    public Loading: boolean = false;

    public otherCompanyPosition: IPosition[] = [];

    public positionInvitations: IPosition[] = [];

    public isLogin: boolean = false;
    public chartLoading: boolean = false;

    public isSearch: boolean = false;

    public relatedArticles: IArticle[] = [];
    public relatedLoading: boolean = false;

    public descriptionShow: boolean = false;

    /* @ngInject */
    constructor(private candidateService: CandidateService,
                private positionService: PositionService,
                private $stateParams: ng.ui.IStateParamsService,
                private messageService: MessageService,
                private userService: UserService,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private authService: AuthService,
                private breadcrumbService: BreadcrumbService,
                private $location: ng.ILocationService,
                private MetaService: MetaService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private localStorageService: any,
                private bookmarkService: BookmarkService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private $timeout: angular.ITimeoutService,
                private articleService: ArticleService) {
        // this
        var vm = this;
        //  set breadService
        //  breadcrumb
        vm.breadcrumbService.clear();
        vm.breadcrumbService.set({title: 'position.positions', url: '/positions-list'});

        // set page config
        MetaService.pageTitle = vm.$translate.instant('search.search_position');

        if (!_.isUndefined($stateParams['categoryIds'])) {
            if (typeof  $stateParams['categoryIds'] === 'string') {
                vm.categoryIds.push($stateParams['categoryIds']);
            } else {
                vm.categoryIds = $stateParams['categoryIds'];
            }
            _.each(vm.categoryIds, function (value: any, index: number) {
                value = parseInt(value);
                if (isNaN(value)) {
                    vm.categoryIds.splice(index, 1);
                } else {
                    vm.categoryIds[index] = value;
                }
            });
            $location.search('categoryIds', vm.categoryIds);
        }


        // position tab
        vm.positionTab = [
            {
                id: 1,
                name: 'position.introduction'
            },
            {
                id: 2,
                name: 'position.related_news'
            }
        ];

        vm.tableLoading = true;

        vm.changeTab(1);

        vm.positionService.getPositionInvitation({}, {cache: false}).then(function (result: any) {
            _.each(result, function (value: any) {
                var item = _.findIndex(vm.positions, {'id': value.id});
                if(item === -1) vm.positions.push(value);
            });
        }).then(function() {
            vm.positionShowMore();
        });
    }

    changeTab(id: number) {
        var vm = this;
        vm.Loading = true;
        vm.positionIndex = id;
        vm.Loading = false;
    }

    // loading search data
    positionShowMore(): void {
        var vm = this;
        vm.pageNum.page++;
        vm.positionService.getSearch({
            search: vm.$stateParams['search'],
            'categoryIds[]': vm.categoryIds,
            'salaryType': vm.$stateParams['salaryType'],
            'minSalary': vm.$stateParams['minSalary'],
            'maxSalary': vm.$stateParams['maxSalary'],
            'educationLevelIds[]': vm.$stateParams['educationLevelIds'],
            'experience': vm.experience,
            'type': vm.$stateParams['type'],
            'locationIds[]': vm.$stateParams['locationIds'],
            'jobNatureId': vm.$stateParams['jobNatureId'],
            'limit': vm.pageNum.limit,
            'page': vm.pageNum.page,
        }, {cache: false}).then(function (result: any) {
            if(result.length > 0) {
                vm.isSearch = true;
            } else {
                vm.tableLoading = false;
            }
            _.each(result, function (val: IPosition, i: number) {
                var index =  _.findIndex(vm.positions, {'id': val.id});
                if (index === -1) {
                    vm.positions.push(val);
                }
            });
            vm.positionMore = result.length >= vm.pageNum.limit ? true : false;
            if (result.length !== 0) vm.changePosition(0);
        }, function (err: any) {
            vm.positions = [];
            vm.tableLoading = false;
        });
    }


    // search result
    changePosition(index: number) {
        var vm = this;
        vm.positionLoading = true;
        vm.firstPosition = vm.positions[index];
        _.each(vm.firstPosition.skills, function(value) {
            value['match'] = false;
        });
        vm.relatedLoading = true;
        vm.articleService.get({'tags': _.map(vm.firstPosition.tags, 'name').join()}, {cache: false}).then(function(result: IArticle[]) {
            vm.relatedArticles = result;
            vm.relatedLoading = false;
        });
        if(vm.authService.checkUser()) {
            vm.userService.getComparedSkill(vm.firstPosition.id, {}, {cache: false}).then(function(skill: any) {
            _.each(skill.skills, function(val) {
                var index = _.findIndex(vm.firstPosition.skills, {'name': val});
                if(index !== -1) {
                    vm.firstPosition.skills[index]['match'] = true;
                }
            });
            });
        }

        vm.firstPosition['bookmarkStatus'] = false;
        vm.positionService.getPositionClickNum(vm.firstPosition.id, {}, {cache: false});
        switch (vm.firstPosition.salaryType) {
            case 'yearly':
                vm.firstPosition.salaryType = 'global.year';
                break;
            case 'monthly':
                vm.firstPosition.salaryType = 'global.month';
                break;
            case 'hourly':
                vm.firstPosition.salaryType = 'global.hour';
                break;
        }

        // save position
        vm.checkCollectPosition(vm.firstPosition.id);
        // get current position educationChart ,experienceChart
        vm.getChart(vm.firstPosition.id);
        // 获取当前用户点击职位的内容
        if (vm.authService.checkUser()) vm.checkApplied(vm.firstPosition.id);
        vm.positionService.getOtherPosition(vm.firstPosition.companyId, {}, {cache: false}).then(function (result: IPosition[]) {
            vm.otherPosition = [];
            _.each(result, function (value: any) {
                if (value.id !== vm.firstPosition.id) vm.otherPosition.push(value);
            });

            vm.tableLoading = false;

        });
        // get other company similar position
        vm.positionService.getRelatedPosition({'categoryIds[]': _.map(vm.firstPosition.categories, 'parentId')}, {cache: false}).then(function (result: any) {
            vm.otherCompanyPosition = [];
            _.each(result, function (val: any) {
                if (val.companyId !== vm.firstPosition.companyId) vm.otherCompanyPosition.push(val);
            });
            vm.positionLoading = false;
        });

    }


    // get candidate
    checkApplied(id: string) {
        var vm = this;
        vm.candidateService.check(id, {}, {cache: false}).then(function (result: any) {
            vm.isApplied = result.check === false ? false : true;
        }, function (err) {
            vm.isApplied = false;
        });
    }


    // position candidate
    setCandidate(positionId: string): void {
        var vm = this;
        if (vm.authService.checkUser()) {
            var modalInstance = vm.$uibModal.open({
                animation: true,
                templateUrl: 'app/components/position/template/applyPositionMessage.html',
                controller: CheckApplyPositionController,
                controllerAs: 'positionCheckApplyCtrl',
                resolve: {
                    /* @ngInject */
                    position: function (positionService: PositionService) {
                        return vm.positionService.find(positionId, {}, {cache: false});
                    }

                }
            });
            modalInstance.result.then(function (result: any) {
                if (result.isCheckApply) {
                    if (result.positionAnswer.length > 0) {
                        vm.candidateService.applyPosition(positionId, {question: result.positionAnswer}).then(function (result: any) {
                            vm.isApplied = true;
                            vm.getChart(positionId);
                            vm.toaster.pop('success', '', vm.$translate.instant('message.apply_position_success_msg'), 3000);
                        }, function (result: IErrorMessage) {
                            vm.messageService.formError(result);
                            vm.toaster.pop('error', '', vm.$translate.instant('message.apply_position_error_msg'), 3000);
                        });
                    } else {
                        vm.candidateService.applyPosition(positionId, {}, {cache: false}).then(function (result: any) {
                            vm.isApplied = true;
                            vm.getChart(positionId);
                            vm.toaster.pop('success', '', vm.$translate.instant('message.apply_position_success_msg'), 3000);
                        }, function (result: IErrorMessage) {
                            vm.messageService.formError(result);
                            vm.toaster.pop('error', '', vm.$translate.instant('message.apply_position_error_msg'), 3000);
                        });
                    }

                }
            }, function () {
                vm.$log.info('Modal dismissed at: ' + new Date());
            });
        } else {
            vm.authService.openLoginForm();
        }

    }


    // collect position
    checkCollectPosition(id: string) {
        var vm = this;
        var index = _.findIndex(vm.positions, {id: id});
        if (vm.authService.checkUser()) {
            vm.bookmarkService.find(id, {}, {cache: false}).then(function (result: IBookmark) {
                vm.firstPosition.bookmarkStatus = true;
                vm.positions[index]['bookmarkStatus'] = true;
            });
        } else {
            _.each(vm.localStorageService.get('bookmark'), function (val: any) {
                if (val.id === id) {
                    vm.firstPosition.bookmarkStatus = true;
                    vm.positions[index]['bookmarkStatus'] = true;
                }

            });
        }

    }


    collectPosition(id: string) {
        var vm = this;
        var index = _.findIndex(vm.positions, {id: id});
        if (vm.authService.checkUser()) {
            vm.bookmarkService.store(id);
        } else {
            var index = _.findIndex(vm.bookmark, {id: id});
            if (index === -1) {
                vm.bookmark.push({id: id});
            }
            vm.localStorageService.set('bookmark', vm.bookmark);
        }
        vm.firstPosition.bookmarkStatus = true;
        vm.positions[index]['bookmarkStatus'] = true;

    }

    removeCollectPosition(id: string) {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/position/template/remove_save_position.html',
            controller: RemoveSavePositionController,
            controllerAs: 'removeCtrl'
        });
        modalInstance.result.then(function (result: boolean) {
            if (result) {
                var item = _.findIndex(vm.positions, {id: id});
                if (vm.authService.checkUser()) {
                    vm.bookmarkService.destroy(id);
                } else {
                    var index = _.findIndex(vm.bookmark, {id: id});
                    if (index !== -1) {
                        vm.bookmark.splice(index, 1);
                        vm.localStorageService.set('bookmark', vm.bookmark);
                    }
                }
                vm.firstPosition.bookmarkStatus = false;
                vm.positions[item]['bookmarkStatus'] = false;

            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }


    // get user experience , education chart
    getChart(id: string) {
        var vm = this;
        vm.chartLoading = true;
        vm.isLogin = vm.localStorageService.get('token') !== null ? true : false;
        vm.positionService.getChart(id, {}, {cache: false}).then(function (result: any) {
            vm.candidateNum = result.totalCandidates;
            vm.educationChartLabels = [];
            vm.educationChartData = [];
            vm.experienceChartData = [];
            vm.experienceChartLabels = [];
            _.each(result.educationLevels, function (value: any) {
                vm.educationChartLabels.push(value.name);
                vm.educationChartData.push(value.value);

            });
            _.each(result.yearOfExperience, function (value: any) {
                vm.experienceChartLabels.push(value.name);
                vm.experienceChartData.push(value.value);
            });
            vm.chartLoading = false;
        });

    }


}
