import {EnterpriseController} from '../enterprise/controller/enterprise.controller';
import {EnterpriseService} from '../enterprise/service/enterprise.service';
import {CreditService} from '../credit_card/service/credit.service';

export class RouteConfig {
  constructor($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
        .state('enterprise.enterprise_show', {
        url: 'company/enterprise',
        templateUrl: 'app/components/enterprise/template/enterprise.html',
        controller: 'EnterpriseController as enterpriseCtrl'
        })
        .state('enterprise.dashboard_show', {
            url: 'company/enterprise/dashboard_show',
            templateUrl: 'app/components/enterprise/template/enterprise_dashboard_show.html',
            controller: 'EnterpriseController as enterpriseCtrl'
        })
        .state('enterprise.company_page_show', {
            url: 'company/enterprise/company_page_show',
            templateUrl: 'app/components/enterprise/template/enterprise_company_page_show.html',
            controller: 'EnterpriseController as enterpriseCtrl'
        });
  }
}

angular.module('frontend')
  .config(RouteConfig)
  .service('enterpriseService', EnterpriseService)
  .controller('EnterpriseController', EnterpriseController);







