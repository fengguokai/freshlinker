import {CompanyAccountService} from '../company_account/service/company_account.service';
import {CompanyAccountController} from '../company_account/controller/company_account.controller';
import {CreditService} from '../credit_card/service/credit.service';

export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('enterprise-auth.company.account', {
                url: 'company/{companyId: int}/account',
                templateUrl: 'app/components/company_account/template/company_account.html',
                controller: 'CompanyAccountController as accountCtrl'
            });

    }
}

angular.module('frontend')
    .config(RouteConfig)
    .service('companyAccountService', CompanyAccountService)
    .controller('CompanyAccountController', CompanyAccountController);







