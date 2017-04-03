import {AuthService, IRegister} from '../service/auth.service';

export class RegisterController {
  // login
  public form: IRegister;
  public loading: boolean = false;

  /* @ngInject */
  constructor(private $timeout: angular.ITimeoutService,
              private authService: AuthService,
              private toaster: ngtoaster.IToasterService,
              private $state: ng.ui.IStateService,
              private $translate: angular.translate.ITranslateService) {
    //
  }

  register(): void {
    var vm = this;
    vm.loading = true;
    this.authService.register(vm.form).then(function () {
      return vm.$state.go('fullscreen.login');
    }, function (result: any) {
      if (result.data.message === 'User already exists.') {
        vm.toaster.pop('error', '', vm.$translate.instant('message.user_exists'), 2000);
      } else if (result.data.message === 'Registration failed.') {
        vm.toaster.pop('error', '', vm.$translate.instant('message.user_register_failed'), 2000);
      } else if (result.data.message === 'Password, 6 to 16 characters required') {
        vm.toaster.pop('error', '', vm.$translate.instant('message.user_login_password_incorrect'), 2000);
      }
      vm.loading = false;
    });
  }
}
