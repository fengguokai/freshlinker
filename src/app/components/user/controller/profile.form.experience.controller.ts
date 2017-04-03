import { IExperience, UserExperienceService} from '../service/user_experience.service.ts';
import {IUser} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';

export class ProfileFormExperienceController {
  public saveLoading: boolean = false;

  /* @ngInject */
  constructor(private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService,
              private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
              private userExperienceService: UserExperienceService,
              private experience: IExperience,
              private $timeout: angular.ITimeoutService,
              private MetaService: MetaService) {
    var vm = this;
    vm.experience = _.isEmpty(vm.experience) ? vm.userExperienceService.init() : vm.experience;
    // change date format
    if (vm.experience.startedDate !== null || vm.experience.endedDate !== null) {
      vm.experience.startedDate = moment(vm.experience.startedDate).toDate();
      vm.experience.endedDate = moment(vm.experience.endedDate).toDate();
    }

    MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.experience');

  }

  // save
  save() {
    var vm = this;
    vm.saveLoading = true;
    if (vm.experience.startedDate > vm.experience.endedDate) {
      vm.toaster.pop('error', '', vm.$translate.instant('message.date_add_error_msg'));
      vm.$timeout(function () {
        vm.saveLoading = false;
      }, 1000);
    } else {
      var data = angular.copy(vm.experience);
      data.startedDate = moment(data.startedDate).format('YYYY-MM-DD');
      data.endedDate = moment(data.endedDate).format('YYYY-MM-DD');
      var savePromise = data.id === '' ? vm.userExperienceService.store(data) : vm.userExperienceService.update( data.id, data);
      savePromise.then(function (result: IExperience) {
        data = result;
        vm.toaster.pop('success', '', vm.$translate.instant(data.id === '' ? 'message.user_profile_experience_create_success_msg' : 'message.user_profile_experience_update_success_msg'));
        vm.saveLoading = false;
        vm.$uibModalInstance.close(result);
      }, function (result: any) {
        vm.saveLoading = false;
      });
    }

  }

  // cancel
  cancel() {
    this.$uibModalInstance.dismiss();
  }

}
