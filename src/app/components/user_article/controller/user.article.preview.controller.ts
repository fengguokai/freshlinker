import {MetaService} from '../../../main/meta.service';
import {UserArticleService} from '../service/user.article.service';
import {ArticleService, IArticle} from '../../article/service/article.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';


export class UserArticlePreviewController {

    public article: IArticle = {};
    public loading: boolean = false;

    /* @ngInject */
    constructor(private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private dashboardTabsService: DashboardTabsService,
                private userArticleService: UserArticleService,
                $stateParams: ng.ui.IStateParamsService,
                private articleService: ArticleService) {
        var vm = this;
        vm.dashboardTabsService.set('article');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.article');

        vm.userArticleService.find($stateParams['articleId'],{}, {cache: false}).then(function(result: IArticle) {
            vm.loading = true;
            vm.article = result;
            vm.articleService.getUserName(vm.article);
            vm.loading = false;
        });


    }




}
