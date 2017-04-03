import {EnterpriseArticleService} from './service/company.article.service';
import {EnterpriseArticleListController} from './controller/company.article.list.controller';
import {EnterpriseArticleEditController} from './controller/company.article.edit.controller';
import {EnterpriseArticlePreviewController} from './controller/company.article.preview.controller';

export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
        $stateProvider
            .state('enterprise-auth.company.article-list', {
                url: 'company/{companyId:int}/article-list',
                templateUrl: 'app/components/company_article/template/company.article_list.html',
                controller: 'EnterpriseArticleListController as articleCtrl'
            })
            .state('enterprise-auth.company.article-edit', {
                url: 'company/{companyId:int}/articles/{articleId: int}',
                templateUrl: 'app/components/company_article/template/company.article.edit.html',
                controller: 'EnterpriseArticleEditController as articleCtrl',
                resolve: {
                    articleCategory: function(enterpriseArticleService: EnterpriseArticleService) {
                        return enterpriseArticleService.getArticleCategoryTree({}, {cache: false});
                    }
                }
            })
            .state('enterprise-auth.company.article_create', {
                url: 'company/{companyId:int}/articles/create',
                templateUrl: 'app/components/company_article/template/company.article.edit.html',
                controller: 'EnterpriseArticleEditController as articleCtrl',
                resolve: {
                    articleCategory: function(enterpriseArticleService: EnterpriseArticleService) {
                        return enterpriseArticleService.getArticleCategoryTree({}, {cache: false});
                    }
                }
            })
            .state('enterprise-auth.company.article-preview', {
                url: 'company/{companyId:int}/articles/{articleId: int}/preview',
                templateUrl: 'app/components/company_article/template/company.article.preview.html',
                controller: 'EnterpriseArticlePreviewController as articleCtrl'
            })
    }
}


angular.module('frontend')
    .config(RouteConfig)
    .controller('EnterpriseArticleListController', EnterpriseArticleListController)
    .controller('EnterpriseArticleEditController', EnterpriseArticleEditController)
    .controller('EnterpriseArticlePreviewController', EnterpriseArticlePreviewController)
    .service('enterpriseArticleService', EnterpriseArticleService);







