import {CompanyPictureService} from './service/company.picture.service';
import {CompanyPictureController} from './controller/company.picture.controller';

export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('enterprise-auth.company.picture', {
                url: 'company/{companyId:int}/pictures',
                templateUrl: 'app/components/company_picture/template/company_picture.html',
                controller: 'CompanyPictureController as companyCtrl'
            });

    }
}

angular.module('frontend')
    .config(RouteConfig)
    .controller('CompanyPictureController', CompanyPictureController)
    .service('companyPictureService', CompanyPictureService);







