/// <reference path="../../typings/index.d.ts" />

import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { EnterpriseMainController } from './main/enterprise.main.controller';
import { AppController } from './main/app.controller';
import { NavbarController } from './components/navbar/controller/navbar.controller';
import { BreadcrumbController } from './components/breadcrumb/controller/breadcrumb.controller';
import { BreadcrumbService } from './components/breadcrumb/service/breadcrumb.service';
import { AuthService } from "./components/auth/service/auth.service";
import { MessageService } from "./shared/global/service/global.service";
import { MetaService } from "./main/meta.service";
import {UserService} from "./components/user/service/user.service";
import {EnterpriseService} from "./components/enterprise/service/enterprise.service";
import { FooterController } from './main/footer/controller/footer.controller';

declare var moment: moment.MomentStatic;

module frontend {
  'use strict';

  angular.module('frontend', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'restangular',
      'ui.router',
      'ui.bootstrap',
      'toaster',
      'slickCarousel',
      'smart-table',
      'textAngular',
      'ui.select',
      'ngFileUpload',
      'pascalprecht.translate', // multi Language plugin
      'LocalStorageModule', // local storage module
      'angularMoment',
      'tmh.dynamicLocale',
      'textAngular',
      'auth0.lock',
      'angular-jwt',
      'rzModule',
      'chart.js',
      'sn.addthis',
      'stripe.checkout',
      'bootstrapLightbox'
    ])
    .constant('moment', moment)
    .constant('_', _)
    .config(routerConfig)
    .run(runBlock)
    .controller('AppController', AppController)
    .controller('MainController', MainController)
    .controller('NavbarController', NavbarController)
    .controller('BreadcrumbController', BreadcrumbController)
      .controller('FooterController', FooterController)
    .service('breadcrumbService', BreadcrumbService)
    .service('messageService', MessageService)
    .service('MetaService', MetaService)
    .controller('EnterpriseMainController', EnterpriseMainController)
    .service('enterprise', EnterpriseService)


    // translate config
    .config(function ($translateProvider: angular.translate.ITranslateProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix: 'app/languages/locale-',
        suffix: '.json'
      });

      $translateProvider.useCookieStorage();
      $translateProvider.useSanitizeValueStrategy('sanitize');
      $translateProvider.preferredLanguage('en-us');
      $translateProvider.fallbackLanguage(['en-us', 'zh-hk', 'zh-cn']);
    })
    .config(['$provide', function ($provide) {
      // this demonstrates how to register a new tool and add it to the default toolbar
      $provide.decorator('taOptions', ['$delegate', function (taOptions) {
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars and classes specified in taOptions.
        taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
        taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
        taOptions.toolbar = [
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
          ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
          ['html', 'insertImage', 'insertLink']
        ];
        taOptions.classes = {
          focussed: 'focussed',
          toolbar: 'btn-toolbar',
          toolbarGroup: 'btn-group',
          toolbarButton: 'btn btn-default',
          toolbarButtonActive: 'active',
          disabled: 'disabled',
          textEditor: 'form-control',
          htmlEditor: 'form-control'
        };
        return taOptions; // whatever you return will be the taOptions
      }]);
    }])

    /**
     * Auth Config
     */
    .run(function ($rootScope: any,
                   authService: any,
                   lock: any) {
      // AUTH
      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.authService = authService;

      // Register the authentication listener that is
      // set up in auth.service.js
      authService.registerAuthenticationListener();

      // Register the synchronous hash parser
      // when using UI Router
      lock.interceptHash();
    })
    .config(function (lockProvider: any,
                      $httpProvider: any,
                      jwtInterceptorProvider: any) {
      // AUTH
      lockProvider.init({
        clientID: 'FCjOEkYq4KF796NLf4CM9fSQfjYBzETn',
        domain: 'freshlinker-test.auth0.com',
        options: {
          autoclose: true,
          languageDictionary: {
            title: "Freshlinker"
          },
          theme: {
            logo: '/assets/img/logo.png',
            primaryColor: "#4a80bc"
          },
          auth: {
            redirect: false,
            sso: false,
            responseType: 'token',
          }
        }
      });

      jwtInterceptorProvider.tokenGetter = function (store) {
        return store.get('token');
      };

      // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
      // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
      // want to check the delegation-token example
      //$httpProvider.interceptors.push('jwtInterceptor');
    })

    // ================================================
    // plugin: Restangular init
    // ================================================
    .config(function (RestangularProvider: restangular.IProvider) {
      RestangularProvider.setBaseUrl('http://192.168.2.53:3000/api/v1');
      RestangularProvider.setRestangularFields({
        ids: '_ids'
      });


      RestangularProvider.addResponseInterceptor(function (data: any, operation: string, what: string, url: string, response: restangular.IResponse, deferred: ng.IDeferred<any>) {
        if (_.isUndefined(data.result)) return data;

        var extractedData;
        if (operation === 'getList') {
          // handle the data and meta data
          extractedData = data.result;
          if (!_.isUndefined(data.meta)) {
            extractedData.meta = data.meta;
          }
        } else {
          extractedData = data.result;
        }

        return extractedData;
      });

      RestangularProvider.setDefaultHttpFields({
        cache: true
      });

    })

    .run(function ($location: ng.ILocationService,
                   authService: AuthService,
                   localStorageService: any,
                   $timeout: ng.ITimeoutService,
                   Restangular: restangular.IProvider,
                   $http: ng.IHttpService,
                   $q: ng.IQService,
                   $rootScope: any,
                   $state: angular.ui.IStateService,
                   $translate: angular.translate.ITranslateService,
                   jwtHelper: any) {
      var vm = this;


      // 设置使用语言.
      if (localStorageService.get('lang') === null) $translate.use('zh-hk');

      /* 非正常退出,跳去登录画面.*/
      Restangular.setErrorInterceptor(function (response: any, deferred: ng.IDeferred<any>) {
        // Error 11000 401 403  404 jump login

        //TODO refresh token
        if (response.data) {
          if (response.data.message === 'invalid token') {
            localStorageService.remove('token');
            localStorageService.remove('company');
            authService.openLoginForm();
            return false;
          }
          if (response.data.message === 'jwt expired') {
            localStorageService.remove('token');
            localStorageService.remove('company');
            authService.openLoginForm();
            return false;
          }
        }

        return true; // error not handled
      });

      Restangular.addFullRequestInterceptor(function (element: any, operation: string, what: string, url: string, headers: any, params: any, httpConfig: restangular.IRequestConfig) {

        // ================================================
        // token setup when load each request
        // ================================================
        if (authService.getToken() !== null && typeof authService.getToken() !== 'undefined' && authService.getToken() !== 'Bearer null') {
          headers.Authorization = authService.getToken();
        }

        return {
          element: element,
          headers: headers,
          params: params,
          httpConfig: httpConfig
        };
      });


      /* @ngInject */
      $rootScope.$on('$stateChangeSuccess', function () {
        $("html, body").animate({scrollTop: 0}, 1);
      });

      /* @ngInject */
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        //console.log('$stateChangeStart', toState, toParams);
        var urlParams = toState.url.split('/');
        localStorageService.set('role', urlParams[0] === 'company' ? 'company' : 'user');

        localStorageService.set('stateLocation', JSON.stringify({
          toState: toState,
          toParams: toParams,
        }));

        // popup login form
        if (!_.isUndefined(toState.data)) {
          if (toState.data.enterpriseAuthenticate === true && !authService.checkEnterprise()) {
            //console.info('access denied, please login!');
            authService.openLoginForm({
              closable: false
            });
            event.preventDefault();
          }
          if (toState.data.userAuthenticate === true && !authService.checkUser()) {
            //console.info('access denied, please login!');
            authService.openLoginForm({
              closable: false
            });
            event.preventDefault();
          }
        }
      });

      /* @ngInject */
      $rootScope.$on('$stateChangeSuccess', function () {
        //
      });

    })
    .factory('PublicRestangular', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://192.168.2.53:3000/api/v1/public');
      });
    });
}
