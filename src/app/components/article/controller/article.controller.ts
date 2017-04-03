import {IArticle, ArticleService} from '../service/article.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {ICategory} from '../../category/service/category.service';
import {AuthService} from '../../auth/service/auth.service';
import {UserService, IUser} from '../../user/service/user.service';
import {MetaService} from '../../../main/meta.service';

export class ArticleController {
  public  hotArticle: IArticle[];
  public  choiceArticle: IArticle[];

  public  category: ICategory[];


  public tabs: any;
  public tabLoading:  any = {};
  public index: any = {};
  public item: number = 1;

  public featuredArticle: IArticle = {};
  public newArticles: IArticle[] = [];
  public popularArticles: IArticle[] = [];

  public featureLoading: boolean = false;
  public newLoading: boolean = false;
  public popularLoading: boolean = false;

  public articleLists: IArticle[] = [];

  public pageNum : {
    page: number,
    limit: number
  } = {
    page: 0,
    limit: 5
  };

  public showMore: any = {};
  public page: any = {};
  public limit: number = 5;
  public careerArticles: IArticle[] = [];
  public blogArticles: IArticle[] = [];
  public shareArticles: IArticle[] = [];
  public tipArticles: IArticle[] = [];
  public insiderArticles: IArticle[] = [];

  public searchArticles: IArticle[] = [];
  public searchArticleLoading: boolean = false;







  /* @ngInject */
  constructor(private $timeout: angular.ITimeoutService,
              private articleService: ArticleService,
              private breadcrumbService: BreadcrumbService,
              private toaster: ngtoaster.IToasterService,
              private $state: ng.ui.IStateService,
              private $translate: angular.translate.ITranslateService,
              private $stateParams: ng.ui.IStateParamsService,
              private MetaService: MetaService,
              private $location: ng.ILocationService) {
    var vm = this;
// set page config
        MetaService.pageTitle = vm.$translate.instant('article.position_article');
    //  breadcrumb
    if(vm.$location.path() === '/article-search') {
      vm.breadcrumbService.clear();
      vm.breadcrumbService.set({title: 'global.articles', url: '#/articles/0/list'});
      vm.breadcrumbService.set({title: vm.$translate.instant('article.search_result')});
    } else {
      vm.breadcrumbService.clear();
      vm.breadcrumbService.set({title: 'global.articles', url: '#/articles/0/list'});
    }
    vm.tabs = [
      {
        id: 1,
        name: 'article.lastest_career_news'
      },
      {
        id: 2,
        name: 'article.expert_blogs'
      },
      {
        id: 3,
        name: 'article.interview_sharing'
      },
      {
        id: 4,
        name: 'article.job_seeking_tips'
      },
      {
        id: 5,
        name: 'article.job_insider'
      }
    ];


    vm.featureLoading = true;
    vm.articleService.get({'sorting': 'featured'}, {cache: false}).then(function(result: IArticle) {
      vm.featuredArticle = result[0];
      vm.featureLoading = false;
    });

    vm.newLoading = true;
    vm.articleService.get({'sorting': 'newest', 'limit': 5}, {cache: false}).then(function(result: IArticle[]) {
      vm.newArticles = result;
      _.each(vm.newArticles, function(value: IArticle) {
        vm.articleService.getUserName(value);
      });
      vm.newLoading = false;
    });

    vm.popularLoading = true;
    vm.articleService.get({'sorting': 'popular', 'limit': 3}, {cache: false}).then(function(result: IArticle[]) {
      vm.popularArticles = result;
      vm.popularLoading = false;
    });


    switch(vm.$stateParams['articleId']) {
      case '0':
        vm.articleTab(1);
        break;
      case '1':
        vm.articleTab(1);
        break;
      case '2':
        vm.articleTab(2);
        break;
      case '3':
        vm.articleTab(3);
        break;
      case '4':
        vm.articleTab(4);
        break;
      case '5':
        vm.articleTab(5);
        break;
    }

    // search article
    if(!_.isUndefined(vm.$stateParams['search'])) {
      vm.articleShowMore();
    }
  }

  articleShowMore(): void {
    var vm = this;
    vm.searchArticleLoading = true;
    vm.articleService.get({
      'search': vm.$stateParams['search'],
      'limit': vm.pageNum.limit,
      'page': vm.pageNum.page,
    }, {cache: false}).then(function (result: IArticle[]) {
      _.each(result, function (val: IArticle, i: number) {
        var index =  _.findIndex(vm.searchArticles, {id: val.id});
        if (index === -1) vm.searchArticles.push(val);
      });

      vm.showMore = result.length >= vm.pageNum.limit ? true : false;
      vm.searchArticleLoading = false;
    }, function (err: any) {
      vm.searchArticles = [];
      vm.searchArticleLoading = false;
    });
  }


  articleTab(id: number) {
    var vm = this;
    var index: number;
    if(_.isUndefined(vm.page[id])) {
      vm.page[id] = 1;
    }
    vm.item = id;
    vm.index[id] = id;
    vm.tabLoading[id] = true;
    vm.articleService.get({'categoryIds[]': id, 'limit': vm.limit, 'page': vm.page[id]}, {cache: false}).then(function(result: IArticle[]) {
      _.each(result, function (val: IArticle, i: number) {
        switch (id) {
          case 1:
                vm.index[id] = _.findIndex(vm.careerArticles, {'id': val.id});
                if(vm.index[id] === -1) {
                  vm.articleService.getUserName(val);
                  vm.careerArticles.push(val);
                }
                break;
          case 2:
            vm.index[id] = _.findIndex(vm.blogArticles, {'id': val.id});
            if(vm.index[id] === -1) {
              vm.articleService.getUserName(val);
              vm.blogArticles.push(val);
            }
            break;
          case 3:
            vm.index[id] = _.findIndex(vm.shareArticles, {'id': val.id});
            if(vm.index[id] === -1) {
              vm.articleService.getUserName(val);
              vm.shareArticles.push(val);
            }
            break;
          case 4:
            vm.index[id] = _.findIndex(vm.tipArticles, {'id': val.id});
            if(vm.index[id] === -1) {
              vm.articleService.getUserName(val);
              vm.tipArticles.push(val);
            }
            break;
          case 5:
            vm.index[id] = _.findIndex(vm.insiderArticles, {'id': val.id});
            if(vm.index[id] === -1) {
              vm.articleService.getUserName(val);
              vm.insiderArticles.push(val);
            }
            break;
        }
      });

      vm.showMore[id] = result.length  >= vm.limit ? true : false;
      vm.$timeout(function() {
        vm.tabLoading[id] = false;
      }, 500);
    });

  }

  showArticleMore(id: number) {
    var vm = this;
    vm.page[id]++ ;
    vm.articleTab(id);
  }

}
