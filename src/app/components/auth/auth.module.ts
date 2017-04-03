import { LoginController } from './controller/login.controller';
import { RegisterController } from './controller/register.controller';
import {AuthService} from './service/auth.service';

module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('fullscreen.login', {
          url: 'login',
          templateUrl: 'app/components/auth/template/login.html',
          controller: 'LoginController as loginCtrl'
        })
        .state('fullscreen.register', {
          url: 'register',
          templateUrl: 'app/components/auth/template/register.html',
          controller: 'RegisterController as registerCtrl'
        })

    }
  }
  angular.module('frontend')
    .config(RouteConfig)
    .controller('LoginController', LoginController)
    .controller('RegisterController', RegisterController)
    .service('authService', AuthService);
}
