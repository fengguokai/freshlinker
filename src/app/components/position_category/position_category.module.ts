import {PositionCategoryService} from './service/position_category.service';
import {PositionCategoryController} from './controller/position.category.controller';
import {PositionService} from '../position/service/position.service';
import {PositionCategoryListController} from './controller/position.list.category.controller';

module frontend {
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
          .state('main.position-categories', {
            url: 'position-categroies',
            templateUrl: 'app/components/position_category/template/position_category.html',
            controller: 'PositionCategoryController as categoryCtrl'
          });
    //.state('main.position-category-list', {
    //        url: 'position-category-list/:parentId/show',
    //        templateUrl: 'app/components/position_category/template/position_category_list.html',
    //        controller: 'PositionCategoryListController as positionListCtrl'
    //    });
    }
  }
  angular.module('frontend')
      .config(RouteConfig)
    .service('positionCategoryService', PositionCategoryService)
    .controller('PositionCategoryController', PositionCategoryController)
      .controller('PositionCategoryListController', PositionCategoryListController);
}
