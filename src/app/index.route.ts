/** @ngInject */
export function routerConfig($locationProvider: ng.ILocationProvider, $stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      abstract: true,
      controller: 'MainController as mainCtrl'
    })

    .state('main-auth', {
      url: '/',
      templateUrl: 'app/main/main.html',
      abstract: true,
      controller: 'MainController as mainCtrl',
      data: {
        userAuthenticate: true
      },
    })

    .state('enterprise', {
      url: '/',
      templateUrl: 'app/main/enterprise.html',
      abstract: true,
      controller: 'EnterpriseMainController as enterpriseCtrl',
      data: {
        enterpriseAuthenticate: false
      },
    })

    .state('enterprise-auth', {
      url: '/',
      templateUrl: 'app/main/enterprise.html',
      abstract: true,
      controller: 'EnterpriseMainController as enterpriseCtrl',
      data: {
        enterpriseAuthenticate: true
      }
    })

    .state('enterprise-auth.company', {
      url: 'company/',
      templateUrl: 'app/main/enterprise-auth-company.html',
      controller: 'EnterpriseMainController as enterpriseCtrl'
    })

    .state('fullscreen', {
      url: '/',
      templateUrl: 'app/main/fullscreen.html',
      abstract: true,
      controller: 'MainController as mainCtrl'
    })

    .state('fullscreen.home', {
      url: '',
      templateUrl: 'app/components/home/template/home.html',
      controller: 'HomeController as homeCtrl'
    });

  $urlRouterProvider.otherwise('/');
}
