import {IArticle, ArticleService} from '../../article/service/article.service';
import {IPosition, PositionService, IResponsive} from '../../position/service/position.service';
import {MetaService} from '../../../main/meta.service';
import {IBanner, BannerService} from '../../banner/service/banner.service';
import {HomeService} from '../service/home.service';
import {AuthService} from '../../auth/service/auth.service';
export class HomeController {
  public myInterval: number;
  public noWrapSlides: boolean = false;
  public currIndex: number;
  public active: number;

  public slides: IBanner[] = [];
  public slideLoading: boolean = false;

  // hotDiscuss
  public hotDiscussIndex: number;
  public tabs: any;

  // hotActive
  public hotActiveIndex: number;

  // category
  public articleTagsLoading: boolean = false;


  // slick
  public slick: IResponsive;

  public positionSlick: IResponsive;

  public bannerSlick: IResponsive;


  // position
  public hotPosition: IPosition[] = [];
  public positionLoading: boolean = false;
  public positions: IPosition[] = [];


  // loading
  public articleLoading: any = {};
  public article: IArticle[] = [];


  /* @ngInject */
  constructor(private articleService: ArticleService,
              private positionService: PositionService,
              private MetaService: MetaService,
              private bannerService: BannerService,
              private $timeout: angular.ITimeoutService,
              private $translate: angular.translate.ITranslateService,
              private localStorageService: any,
              private homeService: HomeService,
              private authService: AuthService) {

    var vm = this;

    vm.hotDiscussIndex = 1;
    vm.hotActiveIndex = 1;


    // get banner
    vm.slideLoading = true;
    vm.bannerService.get({}, {cache: false}).then(function (result: any) {
      var banner = _.get(result, '0.global.banner');
      if (!_.isUndefined(banner)) vm.slides = banner;
      vm.slideLoading = false;
    });

    vm.bannerSlick = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        }
      ]
    };

    // slick
    vm.positionSlick = vm.positionService.slick;

    vm.slick = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        }
      ]
    };

    // get hotPosition
    var initPromise = [];
    vm.positionLoading = true;
    if(vm.authService.checkUser()) {
      var invitationPromise = vm.homeService.getInvitation({}, {cache: false}).then(function(invitationPositions: IPosition[]) {
          _.each(invitationPositions, function(val: IPosition) {
            var i = _.findIndex(vm.hotPosition, {id: val.id});
            if(i === -1) vm.hotPosition.unshift(val);
          });
      });
      initPromise.push(invitationPromise);
    }

    var positionPromise = vm.positionService.get({}, {cache: false}).then(function (result: IPosition[]) {
        vm.positions = result;
    });

    initPromise.push(positionPromise);
    Promise.all(initPromise).then(function() {
      _.each(vm.positions, function(item: IPosition) {
        var index = _.findIndex(vm.hotPosition, {id: item.id});
        if(index === -1) vm.hotPosition.push(item);
      });
      vm.$timeout(function () {
        vm.positionLoading = false;
      });
    });

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


    // loading article at first time
    vm.changeTab('hotActive', 1);
    vm.changeTab('hotDiscuss', 1);




// set page config
    MetaService.pageTitle = '';
  }


  // click tab button loading different data

  changeTab(category: string, tabId: number) {
    var vm = this;
    switch (category) {
      case 'hotDiscuss':
        vm.hotDiscussIndex = tabId;
        break;
      case 'hotActive':
        vm.hotActiveIndex = tabId;
        break;
    }

    vm.articleLoading[tabId] = true;
    if (vm.article[tabId] === undefined) {
      vm.articleService.get({'categoryIds[]': tabId}, {cache: false}).then(function (result: IArticle[]) {
        vm.article[tabId] = result;
        vm.articleLoading[tabId] = false;
      });
    } else {
      vm.articleLoading[tabId] = false;
    }
  }


}
