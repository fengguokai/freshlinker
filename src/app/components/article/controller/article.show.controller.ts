import {IArticle, ArticleService} from '../service/article.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {IPosition, PositionService} from '../../position/service/position.service';
import {MetaService} from '../../../main/meta.service';

export class ArticleShowController {
    public relatedArticles: IArticle[] = [];
    public relatedArticleLoading: boolean = false;
    public relatedPositions: IPosition[] = [];
    public relatedPositionsLoading: boolean = false;
    public loading: boolean = false;
    public article: IArticle = {};

    public otherArticleLoading: boolean = false;
    public otherArticles: IArticle[] = [];

    /* @ngInject */
    constructor(private $timeout: angular.ITimeoutService,
                private articleService: ArticleService,
                private toaster: ngtoaster.IToasterService,
                private $state: ng.ui.IStateService,
                private $translate: angular.translate.ITranslateService,
                private breadcrumbService: BreadcrumbService,
                private positionService: PositionService,
                private $stateParams: ng.ui.IStateParamsService,
                private MetaService: MetaService) {
        var vm = this;

        MetaService.pageTitle = vm.$translate.instant('global.articles');
        vm.loading = true;
        vm.articleService.find(vm.$stateParams['articleId'], {}, {cache: false}).then(function(result: IArticle) {
            vm.article = result;
            vm.articleService.getUserName(vm.article);
            //  breadcrumb
            vm.breadcrumbService.clear();
            vm.breadcrumbService.set({title: 'global.articles', url: '/articles/0/list'});
            vm.breadcrumbService.set({title: vm.article.title});
            vm.articleService.get({'categoryIds[]': _.map(vm.article.categories, 'id'), limit: 5}, {cache: false}).then(function(result: any) {
                vm.relatedArticleLoading = true;
                _.each(result, function(value: any) {
                    if(value.id !== vm.article.id) {
                        vm.articleService.getUserName(value);
                        vm.relatedArticles.push(value);
                    }
                });
                vm.relatedArticleLoading = false;
            });

            vm.articleService.getClickNum(vm.article.id, {}, {cache: false});

            vm.relatedPositionsLoading = true;
            vm.positionService.get({'tags': _.map(vm.article.tags, 'name').join()}, {cache: false}).then(function(result: IPosition[]) {
                vm.relatedPositions = result;
                vm.relatedPositionsLoading = false;
            });
            vm.loading = false;

            vm.otherArticleLoading = true;
            vm.articleService.get({'tag': _.map(vm.article.tags, 'name').join(), 'limit': 4}, {cache: false}).then(function(result: IArticle[]) {
                _.each(result, function(value: any) {
                    if(value.id !== vm.article.id) {
                        vm.otherArticles.push(value);
                    }
                });
                vm.otherArticleLoading = false;
            });

        });
    }
}
