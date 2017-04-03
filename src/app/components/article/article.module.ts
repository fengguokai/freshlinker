import { ArticleController } from './controller/article.controller';
import {ArticleShowController} from './controller/article.show.controller';
import {ArticleService} from './service/article.service';


module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('main.articles', {
          url: 'articles/:articleId/list',
          templateUrl: 'app/components/article/template/article.html',
          controller: 'ArticleController as articleCtrl'
        })
        .state('main.article-search', {
          url: 'article-search?search',
          templateUrl: 'app/components/article/template/article-search.html',
          controller: 'ArticleController as articleCtrl'
        })
        .state('main.articles-show', {
          url: 'articles/:articleId/show',
          templateUrl: 'app/components/article/template/article.show.html',
          controller: 'ArticleShowController as showCtrl'
        });
    }
  }
  angular.module('frontend')
    .config(RouteConfig)
    .controller('ArticleController', ArticleController)
    .service('articleService', ArticleService)
    .controller('ArticleShowController', ArticleShowController);
}
