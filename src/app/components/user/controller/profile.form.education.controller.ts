import { IEducation, UserEducationService} from '../service/user_education.service';
import {IUser} from '../service/user.service.ts';
import {IEducationLevel, EducationLevelService} from '../../education_level/service/education_level.service';
import {MetaService} from '../../../main/meta.service';
import {ISchool, SchoolService} from '../../school/service/school.service';

export class ProfileFormEducationController {
  public saveLoading: boolean = false;
  public graduationYears: number[] = [];
  public myYear: number;
  public educationLevel: IEducationLevel[];
  public gpaError: boolean = false;

  public school: ISchool;
  public schools: ISchool[] = [];
  public schoolLoading: boolean = false;
  public schoolErrorShow: boolean = false;



  /* @ngInject */
  constructor(private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService,
              private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
              private userEducationService: UserEducationService,
              private education: IEducation,
              private educationLevelService: EducationLevelService,
              private MetaService: MetaService,
              private $timeout: any,
              private schoolService: SchoolService) {
    var vm = this;
    vm.education = _.isEmpty(vm.education) ? vm.userEducationService.init() : vm.education;
    // create date
    vm.graduationYears = vm.userEducationService.getYears();
    var myDate = new Date();
    vm.myYear = myDate.getFullYear();
    if(vm.education.id === "") {
      vm.education.graduationYear = vm.myYear - 5;
      vm.education.educationLevelId = 6;
    }

    // get educationLevel
    vm.educationLevelService.get({}, {cahce: false}).then(function(result: IEducationLevel[]) {
      vm.educationLevel = result;
    });

    MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.education');

    vm.schoolService.get({}, {cahce: false}).then(function(result: ISchool[]) {
      vm.schools = result;
    });

    if(!_.isUndefined(vm.education.schoolId)) {
      vm.schoolLoading = true;
      vm.schoolService.find(vm.education.schoolId, {}, {cache: false}).then(function(result: ISchool) {
        vm.school = result;
        vm.schoolLoading = false;
      });
    }

  }



  gpaInput() {
    var vm = this;
    if(_.isNaN(parseInt(vm.education.gpa))) {
      vm.gpaError = true;
    } else if (vm.education.gpa > 5 || vm.education.gpa < 0) {
      vm.gpaError = true;
    } else {
      vm.gpaError = false;
    }
  }

  refreshSchools(school: any) {
    var vm = this;
    vm.schoolService.get({'search': school}, {cache: false}).then(function(result: ISchool[]){
      vm.schools = result;
    });
  }

  schoolSelect() {
    var vm = this;
    if(!_.isUndefined(vm.school)) {
      vm.schoolErrorShow = false;
      vm.education.schoolId = vm.school.id;
    } else {
      vm.schoolErrorShow = true;
      if(vm.saveLoading) {
        vm.$timeout(function() {
          vm.saveLoading = false;
        }, 500);
      }
    }
  }

  // save
  save() {
    var vm = this;
    vm.saveLoading = true;
    vm.schoolSelect();
    if(!vm.schoolErrorShow) {
      if(!vm.gpaError) {
        var data = angular.copy(vm.education);

        var savePromise = data.id === '' ? vm.userEducationService.store(data) : vm.userEducationService.update(data.id, data);

        savePromise.then(function (result: IEducation) {
          data = result;
          vm.toaster.pop('success', '', vm.$translate.instant(data.id === '' ? 'message.user_profile_education_create_success_msg' : 'message.user_profile_education_update_success_msg'));
          vm.saveLoading = false;
          vm.$uibModalInstance.close(result);
        }, function (result: any) {
          vm.saveLoading = false;
        });
      } else {
        vm.$timeout(function() {
          vm.saveLoading = false;
        }, 500);
      }
    }


  }

  // cancel
  cancel() {
    this.$uibModalInstance.dismiss();
  }


}
