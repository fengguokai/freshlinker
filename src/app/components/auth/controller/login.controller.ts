import {AuthService, ILogin} from '../service/auth.service';
import {UserService} from '../../user/service/user.service';

export class LoginController {
  // login
  public form: ILogin;
  public loading: boolean = false;

  /* @ngInject */
  constructor(private authService: AuthService,
              private toaster: ngtoaster.IToasterService,
              private $state: ng.ui.IStateService,
              private $scope: ng.IScope,
              private userService: UserService,
              private $translate: angular.translate.ITranslateService) {
    var vm = this;

  }

  login(): void {

  }

}
