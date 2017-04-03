import { ILanguage, UserLanguageService} from '../service/user_language.service';
import {IUser} from "../service/user.service";
import {MetaService} from '../../../main/meta.service';

export class ProfileFormLanguageController {
    public saveLoading: boolean = false;
    public language: ILanguage;
    public level: number;
    public filter: any = {};
    public userLanguage: any = {};

    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                private userLanguageService: UserLanguageService,
                private $state: ng.ui.IStateService,
                private $timeout: any,
                private MetaService: MetaService,
                private Language: ILanguage,
                private language: ILanguage,
                private $scope: ng.IScope) {
        var vm = this;
        vm.language = _.isEmpty(vm.language) ? vm.userLanguageService.init() : vm.language;

        // get data
        MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.language');


        if (vm.language.id !== "") {
            switch (vm.language.level) {
                case 'elementary':
                    vm.level = 1;
                    break;
                case 'limited_working':
                    vm.level = 2;
                    break;
                case 'professional_working':
                    vm.level = 3;
                    break;
                case 'full_professional':
                    vm.level = 4;
                    break;
                case 'native':
                    vm.level = 5;
                    break;
            }
        } else  {
            vm.level = 1;
        }

        vm.filter = {
            options: {
                step: 1,
                floor: 1,
                ceil: 5,
                showTicksValues: true,
                showSelectionBar: true,
                translate: function (value) {
                    switch (value) {
                        case 1:
                            return vm.$translate.instant('user.profile.elementary');
                            break;
                        case 2:
                            return vm.$translate.instant('user.profile.limited_working');
                            break;
                        case 3:
                            return vm.$translate.instant('user.profile.professional_working');
                            break;
                        case 4:
                            return vm.$translate.instant('user.profile.full_professional');
                            break;
                        case 5:
                            return vm.$translate.instant('user.profile.native');
                            break;
                    }
                }
            }
        };

        vm.$timeout(function () {
            vm.$scope.$broadcast('rzSliderForceRender')
        });


    }


    // save
    save() {
        var vm = this;
        vm.saveLoading = true;
        switch (vm.level) {
            case 1:
                vm.language.level = "elementary";
                break;
            case 2:
                vm.language.level = "limited_working";
                break;
            case 3:
                vm.language.level = "professional_working";
                break;
            case 4:
                vm.language.level = "full_professional";
                break;
            case 5:
                vm.language.level = "native";
                break;
        }
        var data = angular.copy(vm.language);

        vm.userLanguageService.find(data.languageId, {}, {cache: false}).then(function (result: any) {
            var savePromise = data.id === '' ? vm.userLanguageService.store(data) : vm.userLanguageService.update(data.id, data);
            savePromise.then(function (result: any) {
                data = result.languages;
                vm.userLanguage = {
                  id: result.id,
                    name: result.languages.name,
                    UserLanguage: {
                        id: result.id,
                        languageId: result.languageId,
                        level: result.level,
                        userId: result.userId
                    }
                };
                vm.toaster.pop('success', '', vm.$translate.instant(data.languageId === '' ? 'message.user_profile_language_create_success_msg' : 'message.user_profile_language_update_success_msg'));
                vm.$uibModalInstance.close(vm.userLanguage);
                vm.saveLoading = false;
            }, function (err: any) {
                vm.toaster.pop('error', '', vm.$translate.instant('message.user_profile_language_update_error_msg'));
                vm.$timeout(function () {
                    vm.saveLoading = false;
                }, 500)
            });
        });

    }

    // cancel
    cancel() {
        this.$uibModalInstance.dismiss();
    }

}
