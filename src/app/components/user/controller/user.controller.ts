import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {IUser} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';
import { IUser, IUpload, UserService} from '../service/user.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';


export class UserController {
  // login
  public loading: boolean = false;
  public name: string;
  public companyId: string;
  public user: any = {};

  /* @ngInject */
  constructor(private breadcrumbService: BreadcrumbService,
              private MetaService: MetaService,
              private $translate: angular.translate.ITranslateService,
              private dashboardTabsService: DashboardTabsService,
              private localStorageService: any,
              private userService: UserService) {
    var vm = this;
    //  set breadService
    //  breadcrumb
    vm.breadcrumbService.clear();
    vm.breadcrumbService.set({title: 'user.profile.user_profile', url: '/profile'});
    vm.breadcrumbService.set({title: vm.$translate.instant('user.profile.preview_resume')});

    vm.loading = true;
    vm.userService.find({}, {cache: false}).then(function(result: any) {
      vm.user = result;
      switch(vm.user.gender) {
        case 'F':
          vm.user.gender = vm.$translate.instant('global.female');
          break;
        case 'M':
          vm.user.gender = vm.$translate.instant('global.male');
          break;
      }


      vm.name = vm.user.lastName + ' ' + vm.user.firstName;

      vm.loading = false;
    });

    MetaService.pageTitle = vm.$translate.instant('user.profile.resume_preview');
    vm.dashboardTabsService.set("resume");
    vm.companyId = vm.localStorageService.get('company');
  }


}


