import {CompanyService} from './service/company.service';
import {CountryService} from './service/country.service';
import {CompanyFormController} from './controller/company.form.controller';
import {CompanyController} from './controller/company.controller';
import {ApplyForCompanyController} from './controller/apply_for_company.controller';
import {PromptCompanyController} from './controller/prompt_company.controller';


module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('enterprise-auth.company.company_companies_edit', {
          url: 'company/{companyId:int}/edit',
          templateUrl: 'app/components/company/template/company.form.html',
          controller: 'CompanyFormController as formCtrl',
          resolve: {
            countries: function(countryService: CountryService) {
              return countryService.get({},  {cache: false});
            },
            scales: function(companyService: CompanyService) {
              return companyService.getCompanyScale();
            }
          }
        })
        .state('enterprise-auth.company.apply_for_companies', {
          url: 'company/apply-for-company',
          templateUrl: 'app/components/company/template/company.form.html',
          controller: 'ApplyForCompanyController as formCtrl',

          resolve: {
            countries: function(countryService: CountryService) {
              return countryService.get({}, {cache: false});
            },
            scales: function(companyService: CompanyService) {
              return companyService.getCompanyScale();
            }
          }
        })
        .state('enterprise-auth.company.prompt', {
          url: 'company/{companyId: int}/prompt',
          templateUrl: 'app/components/company/template/prompt.list.html',
          controller: 'PromptCompanyController as promptCtrl',

        })
        .state('main.company', {
          url: 'company/{companyId:int}/show',
          templateUrl: 'app/components/company/template/company.html',
          controller: 'CompanyController as companyCtrl',

        });
    }
  }

  angular.module('frontend')
    .config(RouteConfig)
    .controller('CompanyFormController', CompanyFormController)
    .controller('CompanyController', CompanyController)
    .service('countryService', CountryService)
    .service('companyService', CompanyService)
      .controller('ApplyForCompanyController', ApplyForCompanyController)
      .controller('PromptCompanyController', PromptCompanyController);
}





