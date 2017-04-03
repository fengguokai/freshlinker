import {JobOfferService, IJobOffer} from '../company_job_offer/service/company_job_offer.service'
import { JobOfferController } from '../company_job_offer/controller/company_job_offer.controller';
import {IPosition, PositionService} from '../position/service/position.service';
import {EducationLevelService, IEducationLevel} from '../education_level/service/education_level.service';
import {LocationService} from '../location/service/location.service';
import {JobOfferListController} from '../company_job_offer/controller/company_job_offer_list.controller';
import {LanguageService} from '../language/service/language.service';
import {PublicJobOfferController} from '../company_job_offer/controller/public_job_offer.controller';

module frontend {
    'use strict';
    export class RouteConfig {
        constructor($stateProvider: ng.ui.IStateProvider) {
            $stateProvider
                .state('enterprise-auth.company.job_offer', {
                    url: 'company/{companyId:int}/job_offer',

                    templateUrl: 'app/components/company_job_offer/template/company_job_offer.html',
                    controller: 'JobOfferController as jobOfferCtrl',
                    resolve: {
                        positions: function(
                            positionService: PositionService,
                            localStorageService: any) {
                            if(localStorageService.get('company') !== null) return positionService.getByCompanyPosition(localStorageService.get('company'), {active: true}, {cache: false});
                        },
                        educations: function(educationLevelService: EducationLevelService) {
                            return educationLevelService.get({}, {cache: false});
                        },
                        locations: function(locationService: LocationService) {
                            return locationService.getLocationTree({}, {cache: false});
                        },
                        languages: function(languageService: LanguageService) {
                            return languageService.get({}, {cache: false});
                        }
                    }
                })
                .state('enterprise-auth.company.job_offer_edit', {
                    url: 'company/{companyId:int}/job_offer/{jobId:int}',
                    templateUrl: 'app/components/company_job_offer/template/company_job_offer.html',
                    controller: 'JobOfferController as jobOfferCtrl',
                    resolve: {
                        positions: function(
                            positionService: PositionService,
                            localStorageService: any) {
                            if(localStorageService.get('company') !== null) return positionService.getByCompanyPosition(localStorageService.get('company'), {active: true}, {cache: false});
                        },
                        educations: function(educationLevelService: EducationLevelService) {
                            return educationLevelService.get({}, {cache: false});
                        },
                        locations: function(locationService: LocationService) {
                            return locationService.getLocationTree({}, {cache: false});
                        },
                        languages: function(languageService: LanguageService) {
                            return languageService.get({}, {cache: false});
                        }
                    }
                })
                .state('enterprise-auth.company.job_offer_list', {
                    url: 'company/{companyId:int}/job_offer_list',
                    templateUrl: 'app/components/company_job_offer/template/company_job_offer_list.html',
                    controller: 'JobOfferListController as jobOfferListCtrl'
                })

                .state('enterprise-auth.company.job_offer_introduce', {
                    url: 'company/{companyId:int}/job_offer_introduce',
                    templateUrl: 'app/components/company_job_offer/template/company_job_offer_introduce.html',
                    controller: 'JobOfferListController as jobOfferListCtrl'
                })

                .state('main.job_offer_introduce', {
                    url: 'job_offer_introduce',
                    templateUrl: 'app/components/company_job_offer/template/job_offer_introduce.html',
                    controller: 'PublicJobOfferController as jobOfferCtrl'
                })



        }
    }
    angular.module('frontend')
        .config(RouteConfig)
        .controller('JobOfferController', JobOfferController)
        .controller('JobOfferListController', JobOfferListController)
        .controller('PublicJobOfferController', PublicJobOfferController)
        .service('jobOfferService', JobOfferService)
        .service('languageService', LanguageService);


}







