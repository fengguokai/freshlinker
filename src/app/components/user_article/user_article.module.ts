import {UserArticleService} from './service/user.article.service';
import {UserArticleListController } from './controller/user.article.list.controller';
import {UserArticleEditController} from './controller/user.article.edit.controller';
import {UserArticlePreviewController} from './controller/user.article.preview.controller';
module frontend {
    'use strict';
    export class RouteConfig {
        constructor($stateProvider: ng.ui.IStateProvider) {
            $stateProvider
                .state('main-auth.article-list', {
                    url: 'user/articles',
                    templateUrl: 'app/components/user_article/template/article_list.html',
                    controller: 'UserArticleListController  as articleListCtrl',
                    data: {
                        userAuthenticate: true
                    }
                })
                .state('main-auth.article-edit', {
                    url: 'user/article/{articleId: int}/edit',
                    templateUrl: 'app/components/user_article/template/article_edit.html',
                    controller: 'UserArticleEditController as articleCtrl',
                    resolve: {
                        articleCategories: function(userArticleService: UserArticleService) {
                           return userArticleService.getArticleCategoryTree({}, {cache: false});
                        }
                    }
                })

                .state('main-auth.article-preview', {
                    url: 'user/article/{articleId: int}/preview',
                    templateUrl: 'app/components/user_article/template/article_preview.html',
                    controller: 'UserArticlePreviewController as articleCtrl'
                })

                .state('main-auth.article_create', {
                    url: 'user/article/create',
                    templateUrl: 'app/components/user_article/template/article_edit.html',
                    controller: 'UserArticleEditController as articleCtrl',
                    resolve: {
                        articleCategories: function(userArticleService: UserArticleService) {
                            return userArticleService.getArticleCategoryTree({}, {cache: false});
                        }
                    }
                });

        }
    }
    angular.module('frontend')
        .config(RouteConfig)
        .service('userArticleService', UserArticleService)
        .controller('UserArticleListController', UserArticleListController)
        .controller('UserArticleEditController', UserArticleEditController)
        .controller('UserArticlePreviewController', UserArticlePreviewController);

}







