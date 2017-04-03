import {CompanyRechargeController} from './controller/company_recharge.controller';
import {CompanyRechargeService} from './service/company_recharge.service';

export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('enterprise-auth.company.recharge', {
                url: 'company/{companyId: int}/recharge',
                templateUrl: 'app/components/company_recharge/template/company_recharge.html',
                controller: 'CompanyRechargeController as rechargeCtrl'
            })

            .state('enterprise-auth.company.recharge-confirm', {
                url: 'company/{companyId: int}/recharge-confirm',
                templateUrl: 'app/components/company_recharge/template/company_recharge_confirm.html',
                controller: 'CompanyRechargeController as rechargeCtrl'
            });

    }
}

angular.module('frontend')
    .config(RouteConfig)
    .controller('CompanyRechargeController', CompanyRechargeController)
    .service('rechargeService', CompanyRechargeService);







