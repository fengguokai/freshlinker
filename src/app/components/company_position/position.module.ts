import {CompanyPositionFormController } from './controller/company.position.form.controller';
import {CompanyPositionListController } from './controller/company.position.list.controller';
import {CompanyPositionService} from './service/company.position.service';
import {LocationService} from '../location/service/location.service';
import { EducationLevelService} from '../../components/education_level/service/education_level.service';
import {PositionService} from "../position/service/position.service";
import {PositionCategoryService, IPositionCategory} from '../position_category/service/position_category.service';


module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('enterprise-auth.company.company_positions', {
          url: 'company/{companyId:int}/positions',
          templateUrl: 'app/components/company_position/template/position.list.html',
          controller: 'CompanyPositionListController as listCtrl',
          onEnter: function($rootScope) {
            $rootScope.$on('$viewContentLoaded',function(){
              jQuery('html, body').animate({ scrollTop: 0 }, 200);
            });
          }
        })
        .state('enterprise-auth.company.company_positions_create', {
          url: 'company/{companyId:int}/positions/create',
          templateUrl: 'app/components/company_position/template/position.html',
          controller: 'CompanyPositionFormController as formCtrl',
          resolve: {
            position: function (companyPositionService: CompanyPositionService) {
              return companyPositionService.init();
            },
            locations: function (locationService: LocationService) {
              return locationService.getLocationTree({} , {cache: false});
            },
            educations: function(educationLevelService: EducationLevelService){
              return educationLevelService.get({}, {cache: false});
            },
            jobNatures: function(positionService: PositionService) {
              return positionService.getjobNatures({}, {cache: false});
            },
            positionCategories: function(positionCategoryService: PositionCategoryService) {
              return positionCategoryService.getPositionCategory({}, {cache: false});
            }
          }
        })
        .state('enterprise-auth.company.company_positions_edit', {
          url: 'company/{companyId: int}/positions/{positionId:int}/edit',
          templateUrl: 'app/components/company_position/template/position.html',
          controller: 'CompanyPositionFormController as formCtrl',
          resolve: {
            position: function (companyPositionService: CompanyPositionService,
                                $stateParams: ng.ui.IStateParamsService,
                                localStorageService: any
            ) {
              return companyPositionService.find(localStorageService.get('company'), $stateParams['positionId'],{}, {cache: false});
            },
            locations: function (locationService: LocationService) {
              return locationService.getLocationTree({} , {cache: false});
            },
            educations: function(educationLevelService: EducationLevelService){
              return educationLevelService.get({}, {cache: false});
            },
            jobNatures: function(positionService: PositionService) {
              return positionService.getjobNatures({}, {cache: false});
            },
            positionCategories: function(positionCategoryService: PositionCategoryService) {
              return positionCategoryService.getPositionCategory({}, {cache: false});
            }
          }
        });
    }
  }
  angular.module('frontend')
    .config(RouteConfig)
    .controller('CompanyPositionFormController', CompanyPositionFormController)
    .controller('CompanyPositionListController', CompanyPositionListController)
    .service('companyPositionService', CompanyPositionService);
}





