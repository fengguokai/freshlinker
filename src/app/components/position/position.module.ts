import {PositionController } from './controller/position.controller';
import {PositionService} from './service/position.service';
import {CandidateService} from './service/candidate.service';
import {PositionShowController} from './controller/position.show.controller';
import {CompanyPositionController} from './controller/company.position.controller';
import {PositionListController} from './controller/position.list.controller';
import {PositionCategoryService, IPositionCategory} from '../position_category/service/position_category.service';
import {CheckApplyPositionController} from './controller/position.check.apply.controller';
import {UserService} from '../user/service/user.service';
import {IBookmark, BookmarkService} from './service/bookmark.service';
import {RemoveSavePositionController} from './controller/remove.save.position.controller';
import {CompanyService} from '../company/service/company.service';


module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('main.positions', {
          url: 'positions?search&categoryIds&salaryType&minSalary&maxSalary&educationLevelIds&experience&type&locationIds&jobNatureId',
          templateUrl: 'app/components/position/template/position.html',
          controller: 'PositionController as positionCtrl'
        })
        .state('main.show-position', {
          url: 'positions/:id/show',
          templateUrl: 'app/components/position/template/position_show.html',
          controller: 'PositionShowController as positionShowCtrl'
        })
        .state('main.position-list', {
          url: 'positions-list',
          templateUrl: 'app/components/position/template/position_list.html',
          controller: 'PositionListController as positionListCtrl'
        })
        .state('main.company-position-list', {
          url: 'company-positions-list/:companyId/positions',
          templateUrl: 'app/components/position/template/company_position_list.html',
          controller: 'CompanyPositionController as companyPositionCtrl'
        });
    }
  }
  angular.module('frontend')
    .config(RouteConfig)
    .controller('PositionController', PositionController)
    .service('positionService', PositionService)
    .service('candidateService', CandidateService)
      .service('bookmarkService', BookmarkService)
    .controller('PositionShowController', PositionShowController)
    .controller('CompanyPositionController', CompanyPositionController)
    .controller('PositionListController', PositionListController)
    .controller('CheckApplyPositionController', CheckApplyPositionController)
      .controller('RemoveSavePositionController', RemoveSavePositionController)
.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#e9c83b', '#00b216', '#205080', '#ff7b9a', '#f44543', '#ffab45', '#4edfeb'],
    responsive: true
  });
  // Configure all line charts
  ChartJsProvider.setOptions('Line', {
    datasetFill: true
  });
}])
}





