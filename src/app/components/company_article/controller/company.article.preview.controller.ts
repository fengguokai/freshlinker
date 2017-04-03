import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {EnterpriseArticleService, IArticle, IArticleCategory} from '../service/company.article.service';
import {UserService} from '../../user/service/user.service';
import {IArticle, ArticleService} from '../../article/service/article.service';


export class EnterpriseArticlePreviewController {

    public saveLoading: boolean = false;

    public companyId: string;

    public articleNew: any;

    public article: IArticle = {};
    public loading: boolean = false;

    /* @ngInject */
    constructor(private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private dashboardTabsService: DashboardTabsService,
                private localStorageService: any,
                private articleService: ArticleService,
                private enterpriseArticleService: EnterpriseArticleService,
                private $stateParams: ng.ui.IStateParamsService) {
        var vm = this;

        vm.dashboardTabsService.set('article');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.article_preview');

        vm.companyId = vm.localStorageService.get('company');
        vm.enterpriseArticleService.find(vm.localStorageService.get('company'), $stateParams['articleId'], {}, {cache: false}).then(function(result: IArticle) {
            vm.loading = true;
            vm.article = result;
            vm.loading = false;
        });



    }




}
