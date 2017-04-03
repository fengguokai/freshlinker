import {DashboardService} from  '../components/company_dashboard/service/dashboard.service';
import {ICompany} from  '../components/company/service/company.service';
import {IUser,UserService} from '../components/user/service/user.service';
import {AuthService} from '../components/auth/service/auth.service';
import {SelectCompanyController} from '../components/company_dashboard/controller/select.company.controller';
import {RoleService, IRole} from '../components/role/service/role.service';

export class MainController {
  public user: IUser;
  public currentTranslate: string;

  /* @ngInject */
  constructor(private authService: AuthService,
              private userService: UserService,
              private $state: ng.ui.IStateService,
              private $location: ng.ILocationService,
              private localStorageService: any,
              private $scope: ng.IScope,
              private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService,
              private $uibModal: angular.ui.bootstrap.IModalService,
              private $log: ng.ILogService,
              private $timeout: angular.ITimeoutService,
              private localStorageService: any) {
    var vm = this;
     vm.retrieveUser();
    vm.currentTranslate = vm.localStorageService.get('lang') === null ? 'lang.zh_hk' : vm.localStorageService.get('lang');
  }

  retrieveUser() {
    var vm = this;
    if(vm.authService.checkUser()) {
      vm.userService.find({}, {cache: false}).then(function (result: IUser) {
        vm.user = result;
      });
    }

  }


  logout(): void {
    var vm = this;
    vm.authService.logout();
    delete vm.user;
    var stateLocation = JSON.parse(vm.localStorageService.get('stateLocation'));
    if(_.isUndefined(stateLocation.toState.data)) {
      vm.$state.go(stateLocation.toState.name, stateLocation.toParams);
    } else {
      vm.$state.go('fullscreen.home');
    }
  }

  translate(key: string) {
    var vm = this;
    vm.$translate.use(key);
    switch(key) {
      case 'zh-cn':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.zh_cn';
          vm.localStorageService.set('lang', 'lang.zh_cn');
        });
        break;
      case 'zh-hk':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.zh_hk';
          vm.localStorageService.set('lang', 'lang.zh_hk');
        });
        break;
      case 'en-us':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.en_us';
          vm.localStorageService.set('lang', 'lang.en_us');
        });
        break;
    }
  }

}
