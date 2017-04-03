import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {UserArticleService} from '../service/user.article.service';
import {ArticleService, IArticle} from '../../article/service/article.service';


export class UserArticleListController {

    public companyId: string;
    public articles: IArticle[] = [];

    public itemsByPage: number = 10;

    public tableLoading: boolean = false;

    public articleStatus: any[] = [];

    public articleIndex: number = 1;

    public changeTabLoading: boolean = false;

    public articleLoading: boolean = false;


    public filter: {
        limit: number;
        page: number;
        active?: boolean;
        search?: string;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        active: null,
        search: ''
    };

    public noUserName: boolean = false;
    public userName: string;




    /* @ngInject */
    constructor(private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private dashboardTabsService: DashboardTabsService,
                private userArticleService: UserArticleService,
                private localStorageService: any,
                private $location: ng.ILocationService,
                private $timeout: angular.ITimeoutService,
                private toaster: ngtoaster.IToasterService,
                private articleService: ArticleService) {
        var vm = this;
        vm.dashboardTabsService.set('article');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.article_list');
        vm.articleStatus = [
            {
                id: 1,
                name: 'enterprise.article_published'
            },
            {
                id: 2,
                name: 'enterprise.offline_article'
            }
        ];

        vm.articleTab(1);

    }

    articleTab(id: number) {
        var vm = this;
        vm.articleIndex = id;
        vm.changeTabLoading = true;
        vm.articleLoading = true;
        vm.articles = [];
        vm.filter.search = '';
        switch (id) {
            case 1:
                vm.filter.active = true;
                break;
            case 2:
                vm.filter.active = false;
                break;
        }
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }

    searchArticle() {
        var vm = this;
        vm.changeTabLoading = true;
        vm.articleLoading = true;
        vm.articles = [];
        vm.$timeout(function () {
            vm.changeTabLoading = false;
        }, 1);
    }


    callServer(tableState?: any) {
        var vm = this['$parent']['articleListCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];
        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }
        vm.tableLoading = true;
        vm.userArticleService.get(params, {cache: false}).then(function (result: Array<IArticle>) {
            if (result.length !== 0) {
                vm.articles = result;
                _.each(vm.articles, function(value: IArticle) {
                   vm.articleService.getUserName(value);
                });
            }
            if (result.length < vm.filter.limit) {
                tableState['pagination']['next'] = null;
                tableState['pagination']['prev'] = null;
            } else {
                tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
                tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
                if (result.length !== 0) {
                    vm.$location.search('page', result['meta']['pagination']['currentPage']);
                }
            }

            vm.$timeout(function () {
                vm.tableLoading = false;
                vm.articleLoading = false;
            }, 100);

        });
    }



    destory(id: string) {
        var vm = this;
        vm.articleLoading = true;
        vm.userArticleService.destroy(id).then(function (result: any) {
            var index = _.findIndex(vm.articles, {id: id});
            if (index !== -1) vm.articles.splice(index, 1);
            vm.articleLoading = false;
        });
    }


    editArticle(id: string, type: string): void {
        var vm = this;
        var active: boolean;
        vm.articleLoading = true;
        active = type === 'offline' ? false : true;
        vm.userArticleService.editArticle(id , {active: active}).then(function (result: IArticle) {
            switch (type) {
                case 'offline':
                    vm.articleTab(1);
                    break;
                case 're-publish':
                    vm.articleTab(2);
                    break;
            }
            vm.articleLoading = false;
            vm.toaster.pop('success', '', vm.$translate.instant('message.resume_success_msg'));
        });
    }


}
