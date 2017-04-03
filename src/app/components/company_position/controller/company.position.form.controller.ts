import {IPosition,IPositionCategory, CompanyPositionService} from  '../../company_position/service/company.position.service';
import {AuthService} from '../../auth/service/auth.service';
import {UserService} from '../../user/service/user.service';
import {IUser} from "../../user/service/user.service";
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {IEducationLevel, EducationLevelService} from '../../../components/education_level/service/education_level.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {LocationService, ILocation} from '../../location/service/location.service';
import {PositionCategoryService, IPositionCategory} from '../../position_category/service/position_category.service';
import {PositionQuestionService, IPositionQuestion, IPositionQuestionNum} from '../../position_question/service/position.question.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {UserService} from '../../user/service/user.service';
import {IJobNature, PositionService, IExperience, ISkill} from '../../position/service/position.service';
import {CompanyService, ICompany} from '../../company/service/company.service';

export interface IPost {
    id: string;
    question: string;
    isRequired: boolean,
    deleted: boolean
}


export class CompanyPositionFormController {
    public user: Array<IUser>;
    public education: IEducationLevel;

    public positionCategory: IPositionCategory;
    public positionCategorySelected: any = [];
    public positionCategoryChildren: IPositionCategory[] = [];
    public selectedPositionCategory: IPositionCategory[] = [];
    public selectedPositionCategoryIds: any = [];
    public categoryShow: boolean = true;

    public saveLoading: boolean = false;
    public categoryIds: any;
    public salaryType: any;
    public negotiable: boolean = false;


    public positionLocationSelected: any = [];
    public positionLocationChildren: IPositionCategory[] = [];
    public selectedPositionLocation: IPositionCategory;
    public selectedPositionLocationId: any = [];
    public locationShow: boolean = true;

    public tableLoading: boolean = false;

    public positionQuestion: IPost[] = [];
    public num: number = 0;
    public positionQuestionShow: boolean = false;

    public companyId: string;

    public isShow: boolean = false;
    public message: string;

    public experience: IExperience[] = [];
    public defaultTags: ISkill[] = [];
    public defaultSkills: ISkill[] = [];
    public saveSkills: ISkill[] = [];
    public skills: ISkill[] = [];
    public saveTags:any = [];
    public tags:any = [];

    public company: ICompany = {};
    public companyId: string;

    public tableLoading: boolean = false;

    public isPreview: boolean = false;

    public isPreviewShow: boolean = true;

    public isSave: boolean = false;

    public educationLevelName: string;

    public jobNatureName: string;




    /* @ngInject */
    constructor(private companyPositionService: CompanyPositionService,
                private educationLevelService: EducationLevelService,
                private toaster: ngtoaster.IToasterService,
                private messageService: MessageService,
                private $timeout: ng.ITimeoutService,
                private $state: ng.ui.IStateService,
                private $translate: angular.translate.ITranslateService,
                private breadcrumbService: BreadcrumbService,
                private MetaService: MetaService,
                private positionCategoryService: PositionCategoryService,
                private positionQuestionService: PositionQuestionService,
                private $stateParams: ng.ui.IStateParamsService,
                private localStorageService: any,
                private dashboardTabsService: DashboardTabsService,
                private $scope: ng.IScope,
                private positionService: PositionService,
                private userService: UserService,
                private jobNatures: IJobNature[],
                public  position: IPosition,
                private locations: ILocation[],
                private educations: IEducationLevel,
                private positionCategories: IPositionCategory[],
                private companyService: CompanyService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get();
        vm.dashboardTabsService.set('company_positions');
        vm.companyId = vm.localStorageService.get('company');
        MetaService.pageTitle = vm.$translate.instant('enterprise.position_management');

        vm.companyService.find(vm.companyId, {}, {cache: false}).then(function(result: ICompany) {
            vm.company = result;
        });

        // init
        if(position.id === '') {
            position.salaryType = 'monthly';
            position.type = 'full-time';
            position.active = true;
            position.educationLevelId = 6;
            position.experience = '0';
            position.minSalary = 0;
            position.maxSalary = 0;
            vm.position.jobNatureId = 1;
        }

        if (_.isUndefined(vm.position.skills)) vm.position.skills = [];

        if (_.isUndefined(vm.position.tags)) vm.position.tags = [];

        if(vm.position.skills.length > 0) {
            _.each(vm.position.skills, function(value: any) {
                vm.skills.push(value.name);
            });
            vm.position.skills = vm.skills;
        }

        if(vm.position.tags.length > 0) {
            _.each(vm.position.tags, function(value: any) {
                vm.tags.push(value.name);
            });
            vm.position.tags = vm.tags;
        }

        vm.userService.getSkill({'type': 'PositionSkill'}, {cache: false}).then(function (result: any) {
            _.each(result, function (value: any) {
                vm.defaultSkills.push(value.name);
            });
        });

        vm.userService.getSkill({'type': 'PositionTag'}, {cache: false}).then(function (result: any) {
            _.each(result, function (value: any) {
                vm.defaultTags.push(value.name);
            });
        });

        vm.experience = vm.companyPositionService.getExperience();

        // Query position category infomations.
        var initPromise = [];

        if (position.id !== "") {
                vm.tableLoading = true;
                vm.categoryShow = true;
                _.each(position.categories, function (value: any) {
                    vm.positionCategorySelected.push(value.id);
                });
                vm.positionLocationSelected = position.locations;
                if (position.minSalary === 0 && position.maxSalary === 0) vm.negotiable = true;
                vm.setSelectedPositionCategory(positionCategories, null);
                vm.setSelectedPositionLocation(locations, null);
            var getPositionQuestion = vm.positionQuestionService.get(position.companyId, position.id, {}, {cache: false}).then(function (result: any) {
                _.each(result, function (value: any) {
                    vm.positionQuestion.push({
                        id: value.id,
                        question: value.question,
                        isRequired: value.isRequired,
                        isAttachment: value.isAttachment,
                        deleted: false
                    });
                });
                vm.positionQuestionShow = true;
            });

            initPromise.push(getPositionQuestion);
        }


        Promise.all(initPromise).then(function (result) {
            vm.$timeout(function() {
                vm.tableLoading = false;
            });
        });



    }


// add question
    addQuestion() {
        var vm = this;
        vm.num = vm.num + 1;
        vm.positionQuestionShow = true;
        vm.positionQuestion.push({id: '', question: '', isRequired: false, deleted: false});
    }

    setSelectedPositionCategory(children: any, parent: any) {
        var vm = this;
        angular.forEach(children, function (child: any) {
            child.selected = false;
            child.parent = parent;
            if (vm.positionCategorySelected.indexOf(child.id) !== -1) {
                child.selected = true;
                vm.selectedPositionCategory.push(child);
                vm.selectedPositionCategoryIds.push(child.id);
                if (!_.isUndefined(parent) && !_.isNull(parent)) {
                    vm.togglePositionCategory(child.parent);
                }
            } else {
                child.selected = false;
            }
            if (!_.isUndefined(child.children)) vm.setSelectedPositionCategory(child.children, child);
        });
        vm.position.categoryIds = vm.selectedPositionCategoryIds;
    }


    togglePositionCategory(data: any) {
        var vm = this;
        if (!_.isUndefined(data.children)) {
            _.each(vm.positionCategories, function (value: IPositionCategory) {
                if (_.isEqual(value, data)) {
                    data.selected = true;
                } else {
                    value['selected'] = false;
                }
            });
            vm.positionCategoryChildren = data.children;
        }
    }


    addSelectedPositionCategory(data: IPositionCategory) {
        var vm = this;
        var result = _.findIndex(vm.selectedPositionCategory, {id: data.id});
        if (result === -1) {
            if (vm.selectedPositionCategory.length < 5) {
                data['selected'] = true;
                vm.selectedPositionCategory.push(data);
                vm.selectedPositionCategoryIds.push(data.id);
            }
        } else {
            data['selected'] = false;
            vm.selectedPositionCategory.splice(result, 1);
            vm.selectedPositionCategoryIds.splice(result, 1);
            vm.categoryShow = true;
        }
        vm.position.categoryIds = vm.selectedPositionCategoryIds;
    }

    // location
    togglePositionLocation(data: any) {
        var vm = this;
        if (!_.isUndefined(data.children)) {
            _.each(vm.locations, function (value: ILocation) {
                if (_.isEqual(value, data)) {
                    data.selected = true;
                } else {
                    value['selected'] = false;
                }
            });
            vm.positionLocationChildren = data.children;
        }
    }

    addSelectedPositionLocation(data: any) {
        var vm = this;
        vm.selectedPositionLocation = data;
    }

    setSelectedPositionLocation(children: any, parent: any) {
        var vm = this;
        angular.forEach(children, function (child: any) {
            child.parent = parent;
            if (vm.positionLocationSelected.id === child.id) {
                child.selected = true;
                vm.selectedPositionLocation = child;
                if (!_.isUndefined(parent) && !_.isNull(parent)) {
                    vm.togglePositionLocation(child.parent);
                }
            } else {
                child.selected = false;
            }
            if (!_.isUndefined(child.children)) vm.setSelectedPositionLocation(child.children, child);
        });
    }

    isNegotiable(isNegotiable: boolean) {
        var vm = this;
        if(!isNegotiable) vm.position.salaryType = 'monthly';
    }

    preview() {
        var vm = this;

        vm.isPreview = !vm.isPreview;
        // add data


        switch(vm.position.educationLevelId) {
            case 1:
                vm.educationLevelName = 'user.profile.master';
                break;
            case 2:
                vm.educationLevelName = 'user.profile.post_graduate';
                break;
            case 3:
                vm.educationLevelName = 'user.profile.degree';
                break;
            case 4:
                vm.educationLevelName = 'user.profile.college';
                break;
            case 5:
                vm.educationLevelName = 'user.profile.school_certificate';
                break;
            case 6:
                vm.educationLevelName = 'user.profile.any';
                break;
        }

        switch(vm.position.jobNatureId) {
            case 1:
                vm.jobNatureName = 'Admin – Oriented';
                break;
            case 2:
                vm.jobNatureName = 'Analytical – Oriented';
                break;
            case 3:
                vm.jobNatureName = 'Creative - Oriented';
                break;
            case 4:
                vm.jobNatureName = 'Discount Offer';
                break;
            case 5:
                vm.jobNatureName = 'Management - Oriented';
                break;
            case 6:
                vm.jobNatureName = 'People – Oriented';
                break;
            case 7:
                vm.jobNatureName = 'R&D – Oriented';
                break;
            case 8:
                vm.jobNatureName = 'Tech – Oriented';
                break;
        }

        switch(vm.position.salaryType) {
            case 'monthly':
                vm.position.salaryType = 'position.monthly';
                break;
            case 'yearly':
                vm.position.salaryType = 'position.yearly';
                break;
            case 'hourly':
                vm.position.salaryType = 'position.hourly';
                break;
        }


    }

    // Add position
    save(): void {
        var vm = this;
        if(!vm.isPreview) {
            if (vm.negotiable) {
                vm.position.minSalary = 0;
                vm.position.maxSalary = 0;
                delete vm.position.salaryType;
            }
            if (vm.position.categoryIds === undefined || vm.position.categoryIds.length === 0) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.category_input_msg'));

            } else if(vm.position.locationId === null || vm.position.locationId === undefined) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.location_input_msg'));
            } else {

                if (!_.isUndefined(vm.position.skills)) {
                    _.each(vm.position.skills, function (value: any) {
                        vm.saveSkills.push({name: value});
                    });
                    vm.position.skills = vm.saveSkills;
                }

                if (!_.isUndefined(vm.position.tags)) {
                    _.each(vm.position.tags, function (value: any) {
                        vm.saveTags.push({name: value});
                    });
                    vm.position.tags = vm.saveTags;
                }
                vm.saveLoading = true;
                var savePromise = vm.position.id === '' ? vm.companyPositionService.store(vm.companyId, vm.position) : vm.companyPositionService.update(vm.companyId, vm.position.id, vm.position);
                savePromise.then(function (result: IPosition) {
                    vm.position = result;
                    if (vm.positionQuestion.length !== 0) {
                        _.each(vm.positionQuestion, function (value: IPost) {
                            if (value.id === "" && value.deleted === false) vm.positionQuestionService.store(vm.position.companyId, vm.position.id, value);

                            if (value.id !== "" && value.deleted === false) {
                                vm.positionQuestionService.update(vm.position.companyId, vm.position.id, value.id, value).then(function (result) {
                                    var index = _.findIndex(result, {id: value.id});
                                    vm.positionQuestion[index] = result;
                                });
                            }

                            if (value.id !== "" && value.deleted === true) vm.positionQuestionService.destroy(vm.position.companyId, vm.position.id, value.id);

                        });
                    }
                    vm.toaster.pop('success', '', vm.$translate.instant(vm.position.id === '' ? 'message.company_position_create_success_msg' : 'message.company_position_update_success_msg'));
                    vm.$state.go('enterprise-auth.company.company_positions',{companyId: vm.localStorageService.get('company')});
                    vm.saveLoading = false;
                }, function (result: any) {
                    if (result.data.code === 18003) {
                        vm.isShow = true;
                        vm.message = vm.$translate.instant('message.active_jobs_account_insufficient_quantity_error_msg');
                    } else if(result.data.code === 18006) {
                        vm.toaster.pop('error', '', vm.$translate.instant('message.purchase_plan_to_publish_position'));
                        vm.$state.go('enterprise-auth.company.plan_package',{companyId: vm.localStorageService.get('company')});
                    }
                    vm.saveLoading = false;
                });
            }
        }

    }


    deleteQuestion(index: number) {
        var vm = this;
        if (vm.positionQuestion[index].id !== "") {
            vm.positionQuestion[index].deleted = true;
        } else {
            vm.positionQuestion.splice(index, 1);
        }
    }


    // cancel
    cancel() {
        this.$state.go('enterprise-auth.company.company_positions');
    }

}

