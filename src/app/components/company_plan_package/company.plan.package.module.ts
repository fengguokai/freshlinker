import {CompanyPlanPackageController} from './controller/company_plan_package.controller';
import {CompanyPlanPackageDetailController} from './controller/company_plan_package_detail.controller';
import {CompanyPlanPackageService} from './service/company_plan_package.service';

export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
        $stateProvider

            .state('enterprise-auth.company.plan_package', {
                url: 'company/{companyId: int}/plan',
                templateUrl: 'app/components/company_plan_package/template/company_plan_package.html',
                controller: 'CompanyPlanPackageController as planCtrl'
            })
            .state('enterprise-auth.plan_package_detail', {
                url: 'company/plan_package_detail_detail/:plan',
                templateUrl: 'app/components/company_plan_package/template/company_plan_package_detail.html',
                controller: 'CompanyPlanPackageDetailController as planCtrl'
            })
    }
}

angular.module('frontend')
    .config(RouteConfig)
    .controller('CompanyPlanPackageController', CompanyPlanPackageController)
    .controller('CompanyPlanPackageDetailController', CompanyPlanPackageDetailController)
    .service('planService', CompanyPlanPackageService);







