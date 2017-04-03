import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {ICandidate, CandidatePositionService} from  '../../company_interview/service/company_interview.service';
import {IPosition} from '../../position/service/position.service';
import {ArticleService, IArticle} from '../../article/service/article.service';
import {DashboardService} from '../../company_dashboard/service/dashboard.service';
import {CompanyService, ICompany, IPicture} from '../../company/service/company.service';
import {CompanyPictureService} from '../../company_picture/service/company.picture.service';
import {CompanyPositionService, IPosition} from '../../company_position/service/company.position.service';
import {PositionService} from '../../position/service/position.service';

export interface IChart {
  description?: string;
  value?: string;
  name?: string;
}

export class CompanyController {
  public saveLoading: boolean = false;
  public positionIndex: number = 1;
  public articles: IArticle[] = [];
  public articleLoading: boolean = false;

  public company: ICompany = {};
  public companyLoading: boolean = false;

  public pictures: any = [];
  public pictureLoading: boolean = false;


  public  candidateNum: number = 0;

  //educationChart
  public educationChartLabels: IChart[] = [];
  public educationChartData: IChart[] = [];

  //experienceChart
  public experienceChartLabels: IChart[] = [];
  public experienceChartData: IChart[] = [];

  // skillChart
  public skillChartLabels: IChart[] = [];
  public skillChartData: IChart[] = [];

  // schoolChart
  public schoolChartLabels: IChart[] = [];
  public schoolChartData: IChart[] = [];

  // subjectChart
  public subjectChartLabels: IChart[] = [];
  public subjectChartData: IChart[] = [];

  public chartLoading: boolean = false;
  public chartSlick: any;
  public pictureSlick: any;

  public isSkill: boolean = false;
  public isSubject: boolean = false;
  public isSchool: boolean = false;

  public headList: any[] = [];
  public headIndex: number = 1;
  public changeTabLoading: boolean = false;


  // company position
  public companyPositions: IPosition[] = [];

  public positionLoading: boolean = true;

  // company picture
  public companyPictures: any = [];
  public companyPictureLoading: boolean = true;

  public itemsByPage: number = 10;

  public filter: {
    limit: number;
    page: number;
  } = {
    limit: this.itemsByPage,
    page: parseInt(this.$location.search().page) || 1
  };

  // other position
  public otherPositions: IPosition[] = [];
  public tags: any = [];
  public otherPositionLoading: boolean = false;

  public pictureSlick: any;

  public descriptionShow: boolean = false;

  public loadPictures: IPicture[] = [];


  /* @ngInject */
  constructor(private breadcrumbService: BreadcrumbService,
              private companyService: CompanyService,
              private $translate: angular.translate.ITranslateService,
              private MetaService: MetaService,
              private dashboardTabsService: DashboardTabsService,
              private candidatePositionService: CandidatePositionService,
              private articleService: ArticleService,
              private $stateParams: ng.ui.IStateParamsService,
              private dashboardService: DashboardService,
              private companyPictureService: CompanyPictureService,
              private $timeout: any,
              private companyPositionService: CompanyPositionService,
              private $location: ng.ILocationService,
              private positionService: PositionService,
              private Lightbox: any) {
    //
    var vm = this;
    vm.dashboardTabsService.set('company');
    // set page config
    MetaService.pageTitle = vm.$translate.instant('global.company_detail');

    vm.pictureSlick = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: false,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: false,
            arrows: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: false,
            arrows: true
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

    vm.companyLoading = true;
    vm.companyService.find(vm.$stateParams['companyId'], {}, {cache: false}).then(function(result: ICompany) {
      vm.company = result;
      if (vm.company.positions.length > 0) {
        _.each(vm.company.positions, function (value: IPosition) {
          switch (value.salaryType) {
            case 'yearly':
              value.salaryType = 'position.yearly';
              break;
            case 'monthly':
              value.salaryType = 'position.monthly';
              break;
            case 'hourly':
              value.salaryType = 'position.hourly';
              break;
          }

          _.each(vm.company.positions, function(item: any) {
            if(item.tags.length > 0) {
              _.each(item.tags, function(val: any) {
                var index = _.findIndex(vm.tags, {'name': val.name});
                if(index === -1) vm.tags.push({name: val.name});
              });
            }
          });

          vm.otherPositionLoading = true;
          if(vm.tags.length > 0) {
            vm.positionService.get({'tags': _.map(vm.tags, 'name').join()}, {cache: false}).then(function(result: IPosition[]) {
              _.each(result, function(position: IPosition) {
                var i = _.findIndex(vm.otherPositions, {'id': position.id});
                if(i === -1) {
                  if(vm.company.id !== position.companyId) vm.otherPositions.push(position);
                }
              });
              vm.otherPositionLoading = false;
            });
          } else {
            vm.otherPositionLoading = false;
            vm.otherPositions = [];
          }



        })
      }
      vm.companyLoading = false;
    });






    // get articles
    vm.articleLoading = true;
    vm.articleService.get({companyId: vm.company.id, limit: 10}, {cache: false}).then(function (result: IArticle[]) {
      vm.articles = result;
      _.each(vm.articles, function(value: IArticle) {
        vm.articleService.getUserName(value);
      });
      vm.articleLoading = false;
    });

    vm.pictureSlick = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: false,
            arrows: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: false,
            arrows: true
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



    vm.headList = [
      {
        id: 1,
        name: 'company.description'
      },
      {
        id: 2,
        name: 'enterprise.offer_job'
      },
      {
        id: 3,
        name: 'enterprise.picture'
      }
    ];

    vm.changeTab(1);



  }

  changeTab(id: number) {
    var vm = this;
    vm.headIndex = id;
    vm.changeTabLoading = true;
    switch (id) {
      case 1:
            // get pictures
            vm.pictureLoading = true;
            vm.companyPictureService.getPictures(vm.$stateParams['companyId'], {}, {cache: false}).then(function(result: any) {
              vm.pictures = result;
              _.each(vm.pictures, function(value: any) {
                var index = _.findIndex(vm.loadPictures, {id: value.id});
                if(index === -1) vm.loadPictures.push({'id': value.id, 'thumbUrl': value.url['600'],'url': value.url['1024']});
              });
              vm.pictureLoading = false;
              vm.$timeout(function() {
                vm.changeTabLoading = false;
              }, 500);
            });
            break;
      case 2:
          vm.positionLoading = true;
        vm.$timeout(function () {
          vm.changeTabLoading = false;
        }, 1);
            break;
      case 3:
          vm.companyPictureLoading = true;
          vm.$timeout(function() {
            vm.changeTabLoading = false;
          });
            break;


    }

  }

  callServer(tableState: any) {
    var vm = this['$parent']['companyCtrl'];
    var params = angular.copy(vm.filter);
    var pagination = tableState['pagination'];


    if (vm.paginationAction === 'prev') {
      params.page = pagination.prev;
    } else if (vm.paginationAction === 'next') {
      params.page = pagination.next;
    }

    var keys = ['limit', 'page', 'search'];
    _.each(keys, function (value: string, index: number) {
      if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
        delete params[value];
      }
    });

    vm.companyPositionService.getCompanyPosition(vm.$stateParams['companyId'], params, {cache: false}).then(function (result: any) {
      if (result.length !== 0) {
        vm.companyPositions = result;
      }

      if (result.length === 0) {
        tableState['pagination']['next'] = null;
        tableState['pagination']['prev'] = null;
      } else {
        tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
        tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
        vm.$location.search('page', result['meta']['pagination']['currentPage']);
      }

      vm.positionLoading = false;

    });


  }

  callPictureServer(tableState: any) {
    var vm = this['$parent']['companyCtrl'];
    var params = angular.copy(vm.filter);
    var pagination = tableState['pagination'];


    if (vm.paginationAction === 'prev') {
      params.page = pagination.prev;
    } else if (vm.paginationAction === 'next') {
      params.page = pagination.next;
    }

    var keys = ['limit', 'page', 'search'];
    _.each(keys, function (value: string, index: number) {
      if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
        delete params[value];
      }
    });


    vm.companyPictureService.getPictures(vm.$stateParams['companyId'], params, {cache: false}).then(function (result: any) {
      if (result.length !== 0) {
        vm.companyPictures = result;
        _.each(vm.companyPictures, function(value: any) {
          var index = _.findIndex(vm.loadPictures, {id: value.id});
          if(index === -1) vm.loadPictures.push({'id': value.id, 'thumbUrl': value.url['600'],'url': value.url['1024']});
        });


      }

      if (result.length === 0) {
        tableState['pagination']['next'] = null;
        tableState['pagination']['prev'] = null;
      } else {
        tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
        tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
        vm.$location.search('page', result['meta']['pagination']['currentPage']);
      }

      vm.companyPictureLoading = false;

    });


  }

  openLightboxModal(index : number) {
    var vm = this;
    vm.Lightbox.openModal(vm.loadPictures, index);
  }


}
