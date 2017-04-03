import {CreditCardController} from '../credit_card/controller/credit_card.controller';
import {CreditService} from '../credit_card/service/credit.service';
module frontend {
    'use strict';
    export class RouteConfig {
        constructor($stateProvider: ng.ui.IStateProvider) {
            $stateProvider
                .state('enterprise-auth.company.credit_card', {
                    url: 'company/{companyId:int}/credit_card',
                    templateUrl: 'app/components/credit_card/template/credit_card.html',
                    controller: 'CreditCardController as creditCtrl'
                })

        }
    }
    angular.module('frontend')
        .config(RouteConfig)
        .controller('CreditCardController', CreditCardController)
        .service('creditService', CreditService);
}





