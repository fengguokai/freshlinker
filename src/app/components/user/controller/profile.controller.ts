import {IUser, ISkill, UserService} from '../service/user.service';
import {MessageService, IErrorMessage} from '../../../shared/global/service/global.service';
import {ProfileFormExperienceController} from './profile.form.experience.controller';
import {ProfileFormEducationController} from './profile.form.education.controller';
import { UserExperienceService, IExperience } from '../service/user_experience.service';
import { UserEducationService, IEducation } from '../service/user_education.service';
import { EducationLevelService } from '../../education_level/service/education_level.service';
import {PositionService, IPosition} from '../../position/service/position.service';
import {ProfileFormLanguageController} from './profile.form.language.controller';
import {UserLanguageService, ILanguage} from '../service/user_language.service';
import {LanguageService} from '../../language/service/language.service';
import {UserExpectService, IExpect} from '../service/user_expectJobs.service';
import {ProfileFormExpectController} from '../controller/profile.form.expectJobs.controller';
import {MetaService} from '../../../main/meta.service';
import {BookmarkService, IBookmark} from '../../position/service/bookmark.service';
import {IRole, RoleService} from '../../role/service/role.service';
import {LocationService,ILocation} from  '../../location/service/location.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {ProfileFormIconController} from './profile.icon.controller';

export class ProfileController {
    public experienceLoading: boolean = false;
    public userAppiedPosition: IPosition[] = [];
    public tableLoading: boolean = false;
    public Loading: boolean = false;
    public itemsByPage: number = 10;

    public skillShow: boolean = false;
    public skills: ISkill[] = [];
    public skillsUpload: ISkill[] = [];
    public defaultSkills: ISkill[] = [];
    // bookmark

    public filter: {
        limit: number;
        page: number;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1
    };

    public user: IUser = {};
    public name: string;
    public loading: boolean = false;

    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private $translate: angular.translate.ITranslateService,
                private messageService: MessageService,
                private userExperienceService: UserExperienceService,
                private userEducationService: UserEducationService,
                private positionService: PositionService,
                private userLanguageService: UserLanguageService,
                private userExpectService: UserExpectService,
                private $location: ng.ILocationService,
                private $state: ng.ui.IStateService,
                private $timeout: any,
                private MetaService: MetaService,
                private $scope: ng.IScope,
                private dashboardTabsService: DashboardTabsService,
                private userService: UserService) {
        var vm = this;
        MetaService.pageTitle = vm.$translate.instant('user.profile.my_resume');
        vm.dashboardTabsService.set('profile');
        vm.loading = true;
        vm.userService.find({}, {cache: false}).then(function(result: IUser) {
            vm.user = result;
            switch(vm.user.gender) {
                case 'F':
                    vm.user.gender = 'global.female';
                    break;
                case 'M':
                    vm.user.gender = 'global.male';
                    break;
            }

            if(vm.user.skills.length !== 0) {
                _.each(vm.user.skills, function (value: any) {
                    vm.skills.push(value.name);
                });
            }

            vm.userService.getSkill({'type': 'UserSkill'}, {cache: false}).then(function (result: any) {
                _.each(result, function (value: any) {
                    vm.defaultSkills.push(value.name);
                });
            });

            vm.name =  vm.user.firstName + ' ' + vm.user.lastName;

            vm.loading = false;
        });




    }

    // add skill
    addSkill(data: ISkill[]) {
        var vm = this;
        vm.skillsUpload = [];
        _.each(data, function(value: any) {
            vm.skillsUpload.push({name: value});
        });

        vm.userService.store({skills: vm.skillsUpload}).then(function(result: any) {
            vm.user.skills = result.skills;
        })
    }




    // get user applied position
    callPositionServer(tableState: any) {
        var vm = this['$parent']['profileCtrl'];
        var params = angular.copy(vm.filter);
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

        vm.positionService.getByUserAppliedPosition(params, {cache: false}).then(function (result: IPosition[]) {
            if (result.length !== 0) {
                vm.userAppiedPosition = result;
            }
            if (result.length === 0) {
                tableState['pagination']['next'] = null;
                tableState['pagination']['prev'] = null;
                vm.tableLoading = false;
            } else {
                tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
                tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
                vm.$location.search('page', result['meta']['pagination']['currentPage']);
                vm.$timeout(function () {
                    vm.tableLoading = false;
                }, 100);
            }
        }, function (err) {
            vm.userAppiedPosition = null;
            vm.$timeout(function () {
                vm.tableLoading = false;
            }, 100);
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
                vm.user.icon.url['200'] = result;
            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

    // get or store user experience data
    openEditExperienceDialog(index: number): void {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/user/template/profile.experience.form.html',
            controller: ProfileFormExperienceController,
            controllerAs: 'experienceCtrl',
            resolve: {
                /* @ngInject */
                experience: function (userExperienceService: UserExperienceService) {
                    return _.isUndefined(index) ? {} : userExperienceService.find(vm.user.experiences[index].id, {}, {cache: false});

                }
            }
        });
        modalInstance.result.then(function (result: IExperience) {
            _.isUndefined(index) ? vm.user.experiences.push(result) : vm.user.experiences[index] = result;
            vm.$state.reload();
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

    // get or store user educations

    openEditEducationDialog(index: number): void {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/user/template/profile.education.form.html',
            controller: ProfileFormEducationController,
            controllerAs: 'educationCtrl',
            resolve: {
                /* @ngInject */
                education: function (userEducationService: UserExperienceService) {
                    return _.isUndefined(index) ? {} : userEducationService.find(vm.user.educations[index].id, {}, {cache: false});
                },
                /* @ngInject */
                educationLevel: function (educationLevelService: EducationLevelService) {
                    return educationLevelService.get({}, {cache: false});
                }
            }

        });
        modalInstance.result.then(function (result: IEducation) {
            _.isUndefined(index) ? vm.user.educations.push(result) : vm.user.educations[index] = result;
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }



    // get or store user language
    openEditLanguageDialog(index: number): void {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/user/template/profile.language.form.html',
            controller: ProfileFormLanguageController,
            controllerAs: 'languageCtrl',
            resolve: {
                /* @ngInject */
                user: function () {
                    return angular.copy(vm.user);
                },
                /* @ngInject */
                Language: function (languageService: LanguageService) {
                    return languageService.get({}, {cache: false});
                },
                /* @ngInject */
                language: function (userLanguageService: UserLanguageService) {
                    return _.isUndefined(index) ? {} : userLanguageService.find(vm.user.languages[index].UserLanguage.id, {}, {cache: false});
                }
            }
        });
        modalInstance.result.then(function (result: ILanguage) {
            _.isUndefined(index) ? vm.user.languages.push(result) : vm.user.languages[index] = result;
            if(vm.user.languages.length !== 0) {
                _.each(vm.user.languages, function(value: any) {
                    switch(value.UserLanguage.level) {
                        case 'elementary':
                            value.UserLanguage.level = vm.$translate.instant('user.profile.elementary');
                            break;
                        case 'limited_working':
                            value.UserLanguage.level = vm.$translate.instant('user.profile.limited_working');
                            break;
                        case 'full_professional':
                            value.UserLanguage.level = vm.$translate.instant('user.profile.full_professional');
                            break;
                        case 'professional_working':
                            value.UserLanguage.level = vm.$translate.instant('user.profile.professional_working');
                            break;
                        case 'native':
                            value.UserLanguage.level = vm.$translate.instant('user.profile.native');
                            break;
                    }
                })
            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

    // get or store user language
    openEditExpectJobsDialog(id: string): void {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/user/template/profile.expectJobs.form.html',
            controller: ProfileFormExpectController,
            controllerAs: 'expectCtrl',
            resolve: {
                /* @ngInject */
                user: function (userService: UserService) {
                    return userService.find({}, {cache: false})
                },
                /* @ngInject */
                expect: function (userExpectService: UserExpectService) {
                    return _.isUndefined(id) ? {} : userExpectService.find(id, {}, {cache: false});
                },
                /* @ngInject */
                jobNatures: function (positionService: PositionService) {
                    return positionService.getjobNatures({}, {cache: false});
                }
            }
        });
        modalInstance.result.then(function (result: IExpect) {
            _.isUndefined(id) ? vm.user.expectJobs.push(result) : vm.user.expectJobs[0] = result;
            if(vm.user.expectJobs.length !== 0) {
                _.each(vm.user.expectJobs, function(value: any) {
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

                    switch (value.salaryType) {
                        case 'yearly':
                            value.salaryType = vm.$translate.instant('position.yearly');
                            break;
                        case 'monthly':
                            value.salaryType = vm.$translate.instant('position.monthly');
                            break;
                        case 'hourly':
                            value.salaryType = vm.$translate.instant('position.hourly');
                            break;
                    }
                })
            }
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }


    // delete user experience
    removeExperience(id: string): void {
        var vm = this;
        vm.userExperienceService.destroy(id).then(function (result: boolean) {
            var index = _.findIndex(vm.user.experiences, {id: id});
            if (index !== -1) vm.user.experiences.splice(index, 1);
            vm.toaster.pop('success', '', vm.$translate.instant('message.user_profile_experience_remove_success_msg'));
        }, function (result: IErrorMessage) {
            vm.messageService.formError(result);
        });

    }

//  delete user education
    removeEducation(id: string): void {
        var vm = this;
        vm.userEducationService.destroy(id).then(function (result: boolean) {
            var index = _.findIndex(vm.user.educations, {id: id});
            if (index !== -1) vm.user.educations.splice(index, 1);
            vm.toaster.pop('success', '', vm.$translate.instant('message.user_profile_education_remove_success_msg'));
        }, function (result: IErrorMessage) {
            vm.messageService.formError(result);
        });
    }



    //  delete user language
    removeLanguage(id: string, languageId: string): void {
        var vm = this;
        vm.userLanguageService.destroy(languageId).then(function (result: boolean) {
            var index = _.findIndex(vm.user.languages, {id: id});
            if (index !== -1) {
                vm.user.languages.splice(index, 1);
            }
            vm.toaster.pop('success', '', vm.$translate.instant('message.user_profile_language_remove_success_msg'));
        }, function (result: IErrorMessage) {
            vm.messageService.formError(result);
        });
    }

    //  delete user expect_jobs
    removeExpectJobs(id: string): void {
        var vm = this;
        vm.userExpectService.destroy(id).then(function (result: boolean) {
            var index = _.findIndex(vm.user.expectJobs, {id: id});
            if (index !== -1) vm.user.expectJobs.splice(index, 1);
            vm.toaster.pop('success', '', vm.$translate.instant('message.delete_success_msg'));

        }, function (result: IErrorMessage) {
            vm.messageService.formError(result);
        });
    }

}
