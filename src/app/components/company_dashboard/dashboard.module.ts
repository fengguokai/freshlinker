import {DashboardController} from '../company_dashboard/controller/dashboard.controller';
import {DashboardService} from '../company_dashboard/service/dashboard.service';
import {ICompany} from '../company/service/company.service';
import {AuthService} from '../auth/service/auth.service';
import {UserService} from '../user/service/user.service';
import {SelectCompanyController} from '../company_dashboard/controller/select.company.controller';
import {DashboardLeftController} from '../company_dashboard/controller/company.dashboard.left.controller';
import {EnterpriseService} from '../enterprise/service/enterprise.service';

export class DashboardRouteConfig {
  constructor($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
      .state('enterprise-auth.company.company-dashboard', {
        url: 'company/{companyId:int}/dashboard',
        templateUrl: 'app/components/company_dashboard/template/company.dashboard.html',
        controller: 'DashboardController as dashboardCtrl',
        resolve: {
          company: function (dashboardService: DashboardService,
                             localStorageService: any,
                             $stateParams: any,
                             $q: any) {
            var deferred = $q.defer();

            dashboardService.findCompany($stateParams['companyId'], {}, {cache: false}).then(function (result) {
              deferred.resolve(result);
            }, function (err) {
              deferred.reject({
                redirectTo: 'enterprise-auth.company.apply_for_companies'
              });
            });

            return deferred.promise;
          },
          enterprise: function (enterpriseService: EnterpriseService) {
            return enterpriseService.find({}, {cache: false});
          }
        }
      })

      .state('enterprise-auth.company.company-select', {
        url: 'company/company-select',
        templateUrl: 'app/components/company_dashboard/template/select.company.html',
        controller: 'SelectCompanyController as selectCtrl',
        resolve: {
          companies: function (dashboardService: DashboardService) {
            return dashboardService.findCompanyByUser({}, {cache: false});
          }
        }
      });
  }
}


angular.module('frontend')
  .config(DashboardRouteConfig)
  .controller('DashboardController', DashboardController)
  .service('dashboardService', DashboardService)
  .controller('DashboardLeftController', DashboardLeftController)
  .controller('SelectCompanyController', SelectCompanyController);







