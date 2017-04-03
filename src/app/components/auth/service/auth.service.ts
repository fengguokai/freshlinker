import {UserService} from "../../../components/user/service/user.service";
import {EnterpriseService} from "../../../components/enterprise/service/enterprise.service";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthService {
  public isUser: boolean = false;
  public isCompany: boolean = false;

  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any,
              private $q: ng.IQService,
              private $state: any,
              private lock: any,
              private authManager: any,
              private localStorageService: any,
              private userService: UserService,
              private enterpriseService: EnterpriseService,
              private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService) {
    //
  }

  logout(): void {
    var vm = this;
    vm.localStorageService.remove('token');
    vm.localStorageService.remove('company');
    vm.localStorageService.remove('isActivated');

    vm.authManager.unauthenticate();
  }

  getToken(): string {
    var vm = this;
    return vm.localStorageService.get('token');
  }

  checkUser(): boolean {
    return this.localStorageService.get('token') !== null && this.localStorageService.get('isActivated') === 'user';
  }

  checkEnterprise(): boolean {
    return this.localStorageService.get('token') !== null && this.localStorageService.get('isActivated') === 'company';
  }

  openLoginForm(): void {
    this.lock.show();
  }

  openSignupForm(): void {
    this.lock.show({
      allowLogin: false
    });
  }

  openChangePasswordForm(): void {
    this.lock.show({
      initialScreen: 'forgotPassword'
    });
  }


  // Set up the logic for when a user authenticates
  registerAuthenticationListener() {
    var vm = this;
    vm.lock.on('authenticated', function (authResult) {
      var stateLocation = JSON.parse(vm.localStorageService.get('stateLocation'));
      var role = vm.localStorageService.get('role');
      //console.log(`before location:`, stateLocation.toState);
      var initPromise = [];

      vm.localStorageService.set('token', `Bearer ${authResult.idToken}`);

      var isUser = false;
      var isCompany = false;
      var checkUserPromise = vm.userService.checkUser({}, {cache: false}).then(function (result: any) {
        isUser = result.isActivated;
      });

      initPromise.push(checkUserPromise);
      var checkEnterprisePromise = vm.userService.checkEnterprise({}, {cache: false}).then(function (result: any) {
        isCompany = result.isActivated;
      });
      initPromise.push(checkEnterprisePromise);

      Promise.all(initPromise).then(function (profile: any) {

        var registerPromise = null;

        vm.localStorageService.set('yoovProfile', profile);
        if (isUser === true) {
          vm.localStorageService.set('isActivated', 'user');
          if (role !== 'user') {
            vm.toaster.pop('error', '', vm.$translate.instant('message.not_company_role_error_msg'));
            vm.localStorageService.remove('token');
          }
        } else if (isCompany === true) {
          vm.localStorageService.set('isActivated', 'company');
          if (role !== 'company') {
            vm.toaster.pop('error', '', vm.$translate.instant('message.not_user_role_error_msg'));
            vm.localStorageService.remove('token');
          }
        } else if (isCompany === false && isUser === false) {
          vm.localStorageService.set('isActivated', 'noRole');

          if (role !== 'company') {
            vm.localStorageService.set('isActivated', 'user');
            registerPromise = vm.userService.storeUser({
              lastName: '',
              firstName: '',
              email: profile.email,
            });
          } else {
            vm.localStorageService.set('isActivated', 'company');
            registerPromise = vm.enterpriseService.activate({
              lastName: '',
              firstName: '',
              email: profile.email,
            });
          }
        }

        if (registerPromise !== null) {
          registerPromise.then(function () {
            vm.$state.go(stateLocation.toState.name, stateLocation.toParams, {reload: true});
          });
        } else {
          vm.$state.go(stateLocation.toState.name, stateLocation.toParams, {reload: true});
        }
      });


      vm.authManager.authenticate();
    });

  }

}
