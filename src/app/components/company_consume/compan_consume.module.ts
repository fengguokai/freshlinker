import {CompanyConsumeService} from './service/company_consume.service';
import {CompanyConsumeController} from './controller/company_consume.controller';


export class RouteConfig {
  constructor($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
        .state('enterprise-auth.company.consume', {
            url: 'company/{companyId: int}/consume',
            templateUrl: 'app/components/company_consume/template/company_consume.html',
            controller: 'CompanyConsumeController as consumeCtrl'
        });

  }
}

angular.module('frontend')
  .config(RouteConfig)
  .service('companyConsumeService', CompanyConsumeService)
    .controller('CompanyConsumeController', CompanyConsumeController);