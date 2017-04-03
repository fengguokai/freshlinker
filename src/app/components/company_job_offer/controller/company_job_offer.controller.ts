import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IPosition, PositionService} from '../../position/service/position.service';
import {IJobOffer, JobOfferService} from '../../company_job_offer/service/company_job_offer.service';
import {IEducationLevel} from '../../education_level/service/education_level.service';
import {LocationService, ILocation} from '../../location/service/location.service';
import {ISkill, UserService} from '../../user/service/user.service';
import {LocationService, ILocation} from '../../location/service/location.service';
import {CompanyService} from '../../company/service/company.service';
import {ILanguage, LanguageService} from '../../language/service/language.service';
import {EnterpriseService, IEnterprise} from '../../enterprise/service/enterprise.service';

export interface ILanguageLevel {
    id?: number;
    name?: string;
    level?: string;
}

export interface IPost {
    id?: string;
    languageId?: string;
    level?: string;
    name?: string;
    deleted?: boolean
}

export class JobOfferController {

    public types: any = {};

    // skill
    public skills: ISkill[] = [];
    public defaultSkills: ISkill[] = [];


    public saveLoading: boolean = false;
    public companyId: string;

    public totalPrice: number = 0;
    public price: any = [];

    // education
    public educationPrice: any = [];
    public educationName: string;

    public companyId: string;

    public languageLevel: ILanguageLevel[] = [];

    public languageShow: boolean = false;

    public num: number = 0;

    public language: IPost[] = [];

    public postLanguages: IPost[] = [];

    public languagePrice: IPost[] = [];

    public isNext: boolean = false;

    public jobOffer: any = {};
    public loading: boolean = false;

    public experiences: any = [];

    public skillError: boolean = false;

    public balance: string;

    public maxCost: number;


    /* @ngInject */
    constructor(private breadcrumbService: BreadcrumbService,
                private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private positions: IPosition[],
                private jobOfferService: JobOfferService,
                private educations: IEducationLevel[],
                private locationService: LocationService,
                private locations: ILocation[],
                private toaster: ngtoaster.IToasterService,
                private localStorageService: any,
                private $state: ng.ui.IStateService,
                private $timeout: angular.ITimeoutService,
                private userService: UserService,
                private locationService: LocationService,
                private $stateParams: ng.ui.IStateParamsService,
                private companyService: CompanyService,
                private languages: ILanguage[],
                private languageService: LanguageService,
                private positionService: PositionService,
                private enterpriseService: EnterpriseService) {
        var vm = this;
        vm.jobOffer.companyId = vm.localStorageService.get('company');
        vm.languageLevel = [
            {
                id: 1,
                name: 'user.profile.elementary',
                level: 'elementary'
            },
            {
                id: 2,
                name: 'user.profile.limited_working',
                level: 'limited_working'
            },
            {
                id: 3,
                name: 'user.profile.professional_working',
                level: 'professional_working'
            },
            {
                id: 4,
                name: 'user.profile.full_professional',
                level: 'full_professional'
            }
            ,
            {
                id: 5,
                name: 'user.profile.native',
                level: 'native'
            }
        ];

        vm.dashboardTabsService.set('job_offer');
        MetaService.pageTitle = vm.$translate.instant('enterprise.position_offer');
        // set breadcrumb
        vm.breadcrumbService.clear();
        vm.breadcrumbService.set({
            title: vm.$translate.instant('enterprise.dashboard'),
            url: '/company/company/' + vm.localStorageService.get('company') + '/dashboard'
        });

        vm.companyId = vm.localStorageService.get('company');

        vm.types = {
            education: {
                name: 'user.profile.education',
                selected: false,
                type: 'education',
                gpa: '',
                educationLevelId: ''
            },
            skill: {
                name: 'user.profile.skill',
                selected: false,
                type: 'skill'
            },
            languages: {
                name: 'user.profile.language',
                selected: false,
                type: 'languages'
            },
            experience: {
                name: 'user.profile.experience',
                selected: false,
                type: 'experience'
            }
        };

        vm.enterpriseService.find({}, {cache: false}).then(function(result: IEnterprise) {
            vm.balance = result.balance;
        });

        vm.userService.getSkill({'type': 'PositionTag'}, {cache: false}).then(function (result: ISkill[]) {
            _.each(result, function (value: any) {
                vm.defaultSkills.push(value.name);
            });
        });

        vm.loading = true;
        if(!_.isUndefined(vm.$stateParams['jobId'])) {
            vm.jobOfferService.find(localStorageService.get('company'), vm.$stateParams['jobId'], {}, {cache:false}).then(function(result: any) {
                vm.jobOffer = result;
                vm.maxCost = parseInt(vm.jobOffer.maxCost);
                if (!_.isUndefined(vm.jobOffer.filter)) {
                    for (var i = 0; i < vm.jobOffer.filter.length; i++) {
                        var filter = vm.jobOffer.filter[i];
                        if (_.isUndefined(filter.type)) continue;
                        vm.types[filter.type].selected = true;
                        switch (filter.type) {
                            case 'education':
                                if (!_.isUndefined(filter.gpa)) vm.types[filter.type].gpa = filter.gpa;
                                if (!_.isUndefined(filter.educationLevelId)) vm.types[filter.type].educationLevelId = filter.educationLevelId;
                                break;
                            case 'skill':
                                if(!_.isUndefined(filter.value)) vm.skills = filter.value.split(",");
                                break;
                            case 'languages':
                                _.each(filter.value, function(item: any, index: number) {
                                    vm.language.push({id: '', languageId: item.languageId, level: item.level, deleted: false});
                                    vm.getLanguageName(item.languageId, index, vm.types['languages']);
                                });
                                vm.languageShow = true;
                                break;
                            case 'experience':
                                switch(filter.value[0]) {
                                    case '0':
                                        vm.jobOffer.experience = '0-2';
                                        break;
                                    case '3':
                                        vm.jobOffer.experience = '3-5';
                                        break;
                                }
                                break;
                        }
                        vm.check(filter.type);
                    }
                } else {
                    vm.jobOffer.filter = [];
                }

                if(!_.isUndefined(vm.jobOffer.positionId)) vm.jobOffer.positionName = vm.jobOffer.position.name;
            });

        } else {
            vm.jobOffer.experience = '0-2';
            if(_.isUndefined(vm.jobOffer.maxCost)) {
                vm.jobOffer.maxCost = 2000;
                vm.maxCost = 2000;
            }
            vm.jobOffer.filter = [];
            vm.loading = false;
        }

    }

    // getPosition
    getPosition(id: string) {
        var vm = this;
        vm.positionService.find(id, {}, {cache: false}).then(function(result: IPosition) {
            vm.jobOffer.positionName = result.name;
        });
    }

    // checkNext
    checkNext() {
        var vm = this;
        if(_.isUndefined(vm.jobOffer.maxCost)) vm.jobOffer.maxCost = 2000;
        vm.isNext = !vm.isNext;
    }


    // add question
        addLanguage() {
            var vm = this;
            vm.num = vm.num + 1;
            vm.languageShow = true;
            vm.language.push({id: '', languageId: '',name: '', level: 'elementary', deleted: false});
        }

        deleteLanguage(index: number, value: any) {
            var vm = this;
            if (vm.language[index].id !== "") {
                vm.language[index].deleted = true;
            } else {
                vm.language.splice(index, 1);
                vm.postLanguages.splice(index, 1);
            }
            vm.check(value);
        }

        getLanguageName(id: string, index: number, value: any) {
            var vm = this;
            vm.languageService.find(id, {}, {cache: false}).then(function(result: ILanguage) {
                vm.language[index].name = result.name;
                vm.check(value);
            });

        }


    check(item: any) {
        var vm = this;
        var i = _.findIndex(vm.jobOffer.filter, {'type': item.type});
        if (item.selected) {
            switch (item.name) {
                case 'user.profile.education':
                    if (vm.types.education.educationLevelId !== "" || vm.types.education.gpa !== "" ) {
                        if (i !== -1) {
                            if(vm.types.education.gpa !== "") {
                                vm.jobOffer.filter[i] = {
                                    type: 'education',
                                    educationLevelId: vm.types.education.educationLevelId,
                                    gpa: vm.types.education.gpa,
                                    name: 'education'
                                };
                            } else {
                                vm.jobOffer.filter[i] = {
                                    type: 'education',
                                    educationLevelId: vm.types.education.educationLevelId,
                                    name: 'education'
                                };
                            }

                        } else {
                            if(vm.types.education.gpa !== "") {
                                vm.jobOffer.filter.push({
                                    type: 'education',
                                    educationLevelId: vm.types.education.educationLevelId,
                                    gpa: vm.types.education.gpa,
                                    name: 'education'
                                });
                            } else {
                                vm.jobOffer.filter.push({
                                    type: 'education',
                                    educationLevelId: vm.types.education.educationLevelId,
                                    name: 'education'
                                });
                            }

                        }
                    }
                    break;

                case 'user.profile.skill':
                    if(_.isUndefined(vm.skills)) vm.skills = [];
                    if(vm.skillError) {
                        vm.$timeout(function() {
                            vm.skillError = false;
                        }, 2500);
                    }
                    if (vm.skills.length >0 ) {
                        if(vm.skills.length > 3) {
                            _.each(vm.skills, function(val, index) {
                                if(index > 2 || _.isUndefined(val)) vm.skills.splice(index, 1);
                                vm.skills = angular.copy(vm.skills);
                            });
                            vm.skillError = true;
                        } else {
                            vm.skillError = false;
                            if (i !== -1) {
                                vm.jobOffer.filter[i] = {
                                    type: "skill",
                                    value: vm.skills.join(),
                                    name: 'skill'
                                };
                            } else {
                                vm.jobOffer.filter.push(
                                    {
                                        type: "skill",
                                        value: vm.skills.join(),
                                        name: 'skill'
                                    }
                                );
                            }
                        }
                    } else {
                        if (i !== -1) {
                            vm.jobOffer.filter.splice(i, 1);
                        }
                        vm.checkSelectedPrice();
                    }
                    break;
                case 'user.profile.language':
                    if(vm.language.length > 0) {
                        vm.postLanguages = [];
                        _.each(vm.language, function(value: IPost) {
                            vm.postLanguages.push({'name': value.name, 'languageId': value.languageId, 'level': value.level});
                        });
                        if(i !== -1) {
                            vm.jobOffer.filter[i] = {
                                type: "languages",
                                value: vm.postLanguages,
                                name: 'language'
                            };
                        } else {
                            vm.jobOffer.filter.push (
                                {
                                    type: "languages",
                                    value: vm.postLanguages,
                                    name: 'language'
                                }
                            );
                        }
                    }
                    break;
                case 'user.profile.experience':
                    if(_.isUndefined(vm.jobOffer.experience)) vm.jobOffer.experience = '0-2';
                        switch (vm.jobOffer.experience) {
                            case '0-2':
                                vm.experiences = ['0','0.5','1','2'];
                                break;
                            case '3-5':
                                vm.experiences = ['3','4','5','5+'];
                                break;
                        }
                        if(i !== -1) {
                            vm.jobOffer.filter[i] = {
                                type: "experience",
                                value: vm.experiences,
                                name: 'experience'
                            };
                        } else {
                            vm.jobOffer.filter.push (
                                {
                                    type: "experience",
                                    value: vm.experiences,
                                    name: 'experience'
                                }
                            );
                        }

                    break;
            }
            vm.checkSelectedPrice();
        } else {
            var index = _.findIndex(vm.jobOffer.filter, {'type': item.type});
            if (index !== -1) {
                vm.togglePrice(vm.jobOffer.filter[index].type);
                vm.jobOffer.filter.splice(index, 1);
            }
            vm.checkSelectedPrice();
        }
    }

    checkSelectedPrice() {
        var vm = this;
        if(vm.jobOffer.filter.length === 0) {
            vm.totalPrice = 0;
        }
        if(vm.types.education.gpa !== '') {
            if (_.isNaN(parseInt(vm.types.education.gpa))) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.job_offer_gpa_input_number_error_msg'));
            } else {
                if (vm.types.education.gpa > 5 || vm.types.education.gpa < 0) {
                    vm.toaster.pop('error', '', vm.$translate.instant('message.job_offer_gpa_error_msg'));
                } else {
                    vm.checkPrice();
                }
            }
        } else {
            vm.checkPrice();
        }
    }

    checkPrice() {
        var vm = this;
        vm.jobOffer.maxCost = angular.copy(vm.maxCost);
        if(_.isUndefined(vm.jobOffer.maxCost)) vm.jobOffer.maxCost = 2000;
        vm.jobOfferService.checkPrice({
            positionId: vm.jobOffer.positionId,
            companyId: vm.localStorageService.get("company"),
            maxCost: vm.jobOffer.maxCost,
            filter: vm.jobOffer.filter
        }).then(function (result: any) {
            vm.educationPrice = [];
            vm.price = [];
            vm.totalPrice = vm.jobOffer.filter.length > 0 ? result.totalPrice : 0;
            vm.jobOffer.maxPersonNum = result.maxPersonNum;
            vm.jobOffer.maxPerPrice = result.totalPrice;
            _.each(result.filter, function (value: any) {
                switch (value.type) {
                    case 'education':
                        if (value.educationLevelId !== null) {
                            switch (value.educationLevelId) {
                                case 1:
                                    vm.educationName = 'Master';
                                    break;
                                case 2:
                                    vm.educationName = 'Post Graduate';
                                    break;
                                case 3:
                                    vm.educationName = 'Degree';
                                    break;
                                case 4:
                                    vm.educationName = 'College';
                                    break;
                                case 5:
                                    vm.educationName = 'School Certificate';
                                    break;
                                case 6:
                                    vm.educationName = 'Any';
                                    break;
                            }
                            vm.educationPrice['educationLevel'] = vm.educationName;
                        }

                        if (value.gpa !== undefined && value.gpa !== null) vm.educationPrice['gpa'] = value.gpa;
                        vm.educationPrice['price'] = '8';
                        vm.educationPrice['totalPrice'] = value.price;
                        vm.price.push(
                            {
                                type: value.type,
                                name: value.name,
                                value: value.value,
                                price: value.price
                            }
                        );
                        break;

                    case 'skill':
                        vm.price.push(
                            {
                                type: value.type,
                                name: value.name,
                                value: value.value,
                                price: value.price
                            }
                        );
                        break;
                    case 'languages':
                        vm.languagePrice = [];
                        _.each(value.value, function (item: any) {

                            switch (item.level) {
                                case 'elementary':
                                    item.level = vm.$translate.instant('user.profile.elementary');
                                    break;
                                case 'limited_working':
                                    item.level = vm.$translate.instant('user.profile.limited_working');
                                    break;
                                case 'professional_working':
                                    item.level = vm.$translate.instant('user.profile.professional_working');
                                    break;
                                case 'full_professional':
                                    item.level = vm.$translate.instant('user.profile.full_professional');
                                    break;
                                case 'native':
                                    item.level = vm.$translate.instant('user.profile.native');
                                    break;
                            }
                            vm.languagePrice.push({name: item.name, level: item.level, price: 8});
                        });
                        vm.price.push(
                            {
                                type: value.type,
                                name: value.name,
                                value: vm.languagePrice,
                                price: value.price
                            }
                        );
                        break;
                    case 'experience':
                        switch(value.value) {
                            case '[0,0.5,1,2]':
                                vm.jobOffer.experience = '0-2';
                                break;
                            case '[3,4,5,5+]':
                                vm.jobOffer.experience = '3-5';
                                break;
                        }
                        vm.price.push(
                            {
                                type: value.type,
                                name: value.name,
                                value: vm.jobOffer.experience + vm.$translate.instant('message.position_experience_year'),
                                price: value.price
                            }
                        );
                        break;

                }
            });
            vm.loading = false;
        }, function (result: any) {
            if (result.data.code === 12002)
                vm.toaster.pop('error', '', vm.$translate.instant('message.job_offer_max_cost_error_msg'));
            if(result.data.code === 12007)
                vm.toaster.pop('error', '', vm.$translate.instant('message.job_offer_three_skills_error_msg'));
            vm.loading = false;
        });
    }





    postOffer() {
        var vm = this;
        vm.saveLoading = true;

        if (vm.jobOffer.filter.length === 0) {
            vm.toaster.pop('error', '', vm.$translate.instant('message.select_position_post_job_offer'));
        } else {
            if (vm.types.skill.selected && _.isUndefined(vm.skills)) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.position_skill_select'));
            } else {
                if(vm.jobOffer.maxCost > vm.balance) {
                    vm.toaster.pop('error', '', vm.$translate.instant('message.credit_card_balance_no'));
                    vm.$state.go('enterprise-auth.company.recharge', {companyId: vm.jobOffer.companyId});
                } else {
                    if(_.isUndefined(vm.jobOffer.id)) {
                        vm.jobOfferService.store(vm.localStorageService.get("company"), {
                            positionId: vm.jobOffer.positionId,
                            companyId: vm.localStorageService.get("company"),
                            maxCost: vm.jobOffer.maxCost,
                            filter: vm.jobOffer.filter
                        }).then(function (result: any) {
                            vm.toaster.pop('success', '', vm.$translate.instant('message.job_offer_send_success_msg'));
                            vm.$state.go('enterprise-auth.company.job_offer_list', {companyId: vm.companyId});
                        }, function (result: any) {
                            if (result.data.code === 12000) vm.toaster.pop('error', '', vm.$translate.instant('message.current_position_have_set_error_msg'));
                        });
                    } else {
                        vm.jobOfferService.update(vm.jobOffer.companyId, vm.jobOffer.id,
                            {
                                positionId: vm.jobOffer.positionId,
                                companyId: vm.localStorageService.get("company"),
                                maxCost: vm.jobOffer.maxCost,
                                filter: vm.jobOffer.filter
                            }
                        ).then(function(result: any) {
                            vm.toaster.pop('success', '', vm.$translate.instant('message.job_offer_update_success_msg'));
                            vm.$state.go('enterprise-auth.company.job_offer_list', {companyId: vm.companyId});
                        });
                    }
                }
            }
        }
        vm.$timeout(function () {
            vm.saveLoading = false;
        }, 500);
    }

    togglePrice(type: string) {
        var vm = this;
        switch (type) {
            case 'education':
                vm.types.education.educationLevelId = "";
                vm.types.education.gpa = "";
                break;
            case 'skill':
                vm.skills = [];
                break;
            case 'languages':
                vm.language = [];
                break;
        }
    }

}
