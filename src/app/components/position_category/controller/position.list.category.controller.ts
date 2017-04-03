import { IPosition, PositionService} from '../../position/service/position.service';
import {IUser, UserService} from '../../user/service/user.service';
import {AuthService} from '../../auth/service/auth.service';
import {CandidateService} from '../../position/service/candidate.service';
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {IPositionCategory, PositionCategoryService} from '../../position_category/service/position_category.service';
import {CheckApplyPositionController} from '../../position/controller/position.check.apply.controller';
import {BookmarkService, IBookmark} from '../../position/service/bookmark.service';
import {RemoveSavePositionController} from '../../position/controller/remove.save.position.controller';
import {ArticleService, IArticle} from '../../article/service/article.service';


export class PositionCategoryListController {
    public positions: IPosition[] = [];
    public firstPosition: IPosition;
    public otherPosition: IPosition[];
    public isApplied: boolean = false;
    public user: IUser;
    public tableLoading: boolean = false;

    public isUser: boolean = false;


    public filter: {
        limit: number;
        page: number;
        categoryId: number;
    } = {
        limit: 5,
        page: 0,
        categoryId: 0
    };

    public search: string;
    public companyId: number;
    public positionCategoryName: IPositionCategory[] = [];
    public minSalary: string;
    public maxSalary: string;
    public educationLevel: any = [];
    public experience: string;
    public positionMore: boolean;


    public experienceRange: any = [
        '0', '0-1', '1-3', '1-3', '3-5', '3-5', '5-10', '5-10', '5-10', '5-10', '5-10', '10-15', '10-15', '10-15', '10-15', '10-15', '10-15', '15-20', '15-20', '15-20', '15-20', '15-20', '15-20'
    ];


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

    public isShow: boolean = false;
    public isLogin: boolean = false;
    public chartLoading: boolean = false;

    public relatedArticles: IArticle[] = [];
    public relatedLoading: boolean = false;

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
                private $state: ng.ui.IStateService,
                private $timeout: angular.ITimeoutService,
                private articleService: ArticleService) {
        // this
        var vm = this;
        vm.filter.categoryId = vm.$stateParams['parentId'];
        // set breadcrumb
        vm.breadcrumbService.clear();
        vm.breadcrumbService.set({title: vm.$translate.instant('navbar.position_search'), url:'/position-categroies'});

        // set page config
        MetaService.pageTitle = vm.$translate.instant('navbar.position_search') + '-' + vm.$translate.instant('global.positions');

        vm.tableLoading = true;

        vm.positionShowMore();
        // position tab
        vm.positionTab = [
            {
                id: 1,
                name: vm.$translate.instant('position.introduction')
            },
            {
                id: 2,
                name: vm.$translate.instant('position.related_news')
            }
        ];

        vm.changeTab(1);

    }

    changeTab(id: number) {
        var vm = this;
        vm.Loading = true;
        vm.positionIndex = id;
    }


        // loading search data
    positionShowMore(): void {
        var vm = this;
        vm.filter.page++;
        vm.positionService.getCategroyPosition({
            'limit': vm.filter.limit,
            'page': vm.filter.page,
            'categoryIds[]': vm.filter.categoryId
        }, {cache: false}).then(function (result: IPosition[]) {
            _.each(result, function (val: IPosition, i: number) {
                vm.positions.push(val);
            });
            vm.positionMore = result.length > vm.filter.limit ? true : false;
            if (vm.positions.length !== 0) vm.changePosition(0);
            vm.tableLoading = false;
        }, function (err: any) {
            vm.positions = null;
        });
    }



    // search result
    changePosition(index: number) {
        var vm = this;
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
                vm.firstPosition.salaryType = vm.$translate.instant('global.year');
                break;
            case 'monthly':
                vm.firstPosition.salaryType = vm.$translate.instant('global.month');
                break;
            case 'hourly':
                vm.firstPosition.salaryType = vm.$translate.instant('global.hour');
                break;
        }

        switch (vm.firstPosition.experience) {
            case '0':
                vm.firstPosition.experience = vm.$translate.instant('message.position_experience_no');
                break;
            case '5+':
                vm.firstPosition.experience = vm.$translate.instant('message.position_experience_5');
                break;
            default:
                vm.firstPosition.experience = vm.firstPosition.experience + vm.$translate.instant('message.position_experience_year');
                break;
        }

        // save position
        vm.checkCollectPosition(vm.firstPosition.id);
        // get current position educationChart ,experienceChart
        vm.getChart(vm.firstPosition.id);
        // 获取当前用户点击职位的内容
        if(vm.authService.checkUser()) vm.checkApplied(vm.firstPosition.id);
        vm.positionService.getOtherPosition(vm.firstPosition.companyId, {},  {cache: false}).then(function (result: IPosition[]) {
            vm.otherPosition = [];
            _.each(result, function(value: any) {
                switch (value.type) {
                    case 'full-time':
                        value.type = vm.$translate.instant('position.full-time');
                        break;
                    case 'part-time':
                        value.type = vm.$translate.instant('position.part-time');
                        break;
                    case 'other':
                        value.type = vm.$translate.instant('position.other');
                        break;
                }
                if(value.id !== vm.firstPosition.id) vm.otherPosition.push(value);
            });
        });
        // get other company similar position
        vm.positionService.getRelatedPosition({'categoryIds[]': _.map(vm.firstPosition.categories, 'parentId')},{cache: false}).then(function(result: any) {
            vm.otherCompanyPosition = [];
            _.each(result, function(val: any) {
                if(val.companyId !== vm.firstPosition.companyId) vm.otherCompanyPosition.push(val);
            });
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
                    position: function(positionService: PositionService) {
                        return vm.positionService.find(positionId, {}, {cache:false});
                    }

                }
            });
            modalInstance.result.then(function (result: any) {
                if (result.isCheckApply) {
                    if(result.positionAnswer.length > 0) {
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
            vm.$state.go('main.jobFlatform');
        }

    }


    // collect position
    checkCollectPosition(id: string) {
        var vm = this;
        if(vm.authService.checkUser()) {
            vm.bookmarkService.find(id, {}, {cache: false}).then(function(result: IBookmark){
                _.each(vm.positions, function(val: any) {
                    if(val.id === result.id)  {
                        vm.firstPosition.bookmarkStatus = true;
                        val.bookmarkStatus = true;
                    }
                });
            });
        } else {
            _.each(vm.localStorageService.get('bookmark'), function(val: any) {
                if(val.id === id) {
                    vm.firstPosition.bookmarkStatus = true;
                    var index = val.id;
                }
                _.each(vm.positions, function(value: any) {
                    if(value.id === index) value.bookmarkStatus = true;
                });

            });
        }

    }



    collectPosition(id: string) {
        var vm = this;
        if (vm.authService.checkUser()) {
            vm.bookmarkService.store(id);
        } else {
            var index = _.findIndex(vm.bookmark, {id: id});
            if(index === -1) {
                vm.bookmark.push({id: id});
            }
            vm.localStorageService.set('bookmark', vm.bookmark);
        }
        _.each(vm.positions, function(val: any) {
            if(val.id === id) {
                val.bookmarkStatus = true;
                vm.firstPosition.bookmarkStatus = true;
            }
        });
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
            if(result) {
                if(vm.authService.checkUser()) {
                    vm.bookmarkService.destroy(id);
                    vm.firstPosition.bookmarkStatus = false;
                } else {
                    var index = _.findIndex(vm.bookmark, {id: id});
                    if(index !== -1) {
                        vm.bookmark.splice(index, 1);
                        vm.localStorageService.set('bookmark', vm.bookmark);
                        vm.firstPosition.bookmarkStatus = false;
                    }
                }

                _.each(vm.positions, function(val: any) {
                    if(val.id === id) {
                        val.bookmarkStatus = false;
                    }
                });

            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }



    // get user experience , education chart
    getChart(id: string) {
        var vm = this;
        vm.chartLoading = true;
        vm.isShow = vm.authService.checkUser() ? false : true;
        vm.isLogin = vm.authService.checkUser() ? true : false;

        if(vm.isLogin) {
            vm.positionService.getChart(id, {}, {cache: false}).then(function (result: any) {
                vm.candidateNum = result.totalCandidates;
                if(vm.candidateNum < 5) vm.isShow = true;
                vm.educationChartLabels = [];
                vm.educationChartData = [];
                vm.experienceChartData = [];
                vm.experienceChartLabels = [];
                _.each(result.educationLevels, function (value: any) {
                    vm.educationChartLabels.push(value.name);

                });
                _.each(result.yearOfExperience, function (value: any) {
                    vm.experienceChartLabels.push(value.name);
                });
                if(!vm.isShow) {
                    _.each(result.educationLevels, function (value: any) {
                        vm.educationChartData.push(value.value);

                    });
                    _.each(result.yearOfExperience, function (value: any) {
                        vm.experienceChartData.push(value.value);

                    });
                } else {
                    vm.candidateNum = 6;
                    vm.educationChartData = [2,3,1,0,0,0,0];
                    vm.experienceChartData = [3,0,2,0,1,0];
                }

                vm.chartLoading = false;

            });
        } else {
            vm.candidateNum = 6;
            vm.educationChartData = [2,3,1,0,0,0,0];
            vm.experienceChartData = [3,0,2,0,1,0];
            vm.educationChartLabels = ["Master", "Post Graduate", "Degree", "College", "School Certificate", "Any", "N/A"];
            vm.experienceChartLabels = ["fifteenYears", "tenYears", "fiveYears", "threeYears", "oneYears", "N/A"];

            vm.$timeout(function() {
                vm.chartLoading = false;
            }, 1000);
        }
    }


}

