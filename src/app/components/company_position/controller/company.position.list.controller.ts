import {DashboardService} from  '../../company_dashboard/service/dashboard.service';
import {ICompany} from '../../company/service/company.service';
import {IPosition, CompanyPositionService} from  '../../company_position/service/company.position.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';


export interface IChart {
  description?: string;
  value?: string;
  name?: string;
}

export class CompanyPositionListController {
  public company: Array<ICompany> = [];
  public positions: Array<IPosition>;
  public itemsByPage: number = 5;
  public tableLoading: boolean = false;
  public positionIndex: number = 1;
  public positionNull: boolean = false;
  public currentDate: Date;
  public positionLoading: boolean = false;

  public filter: {
    limit: number;
    page: number;
    active?: boolean;
    minExpiredDate?: Date;
    maxExpiredDate?: Date;
    search?: string;

  } = {
    limit: this.itemsByPage,
    page: parseInt(this.$location.search().page) || 1,
    active: null,
    maxExpiredDate: null,
    minExpiredDate: null,
    search: ''
  };


  // position
  public positionStatus: any[] = [];
  public changeTabLoading: boolean = false;

  public companyId: string;

  // chart
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
  public chartIndex: number;
  public chartTabs: any = [];
  public chartSlick: any;

  public isSkill: boolean = false;
  public isSubject: boolean = false;
  public isSchool: boolean = false;


  /* @ngInject */
  constructor(public companyPositionService: CompanyPositionService,
              private $location: ng.ILocationService,
              private dashboardService: DashboardService,
              private toaster: ngtoaster.IToasterService,
              private $state: ng.ui.IStateService,
              private $translate: angular.translate.ITranslateService,
              private $timeout: angular.ITimeoutService,
              private MetaService: MetaService,
              private localStorageService: any,
              private dashboardTabsService: DashboardTabsService) {
    //
    var vm = this;
    vm.dashboardTabsService.set('company_positions');
    // get data
    vm.dashboardService.findCompanyByUser({}, {cache: false}).then(function (resultCompany: Array<ICompany>) {
      vm.company = resultCompany;
    });

    vm.currentDate = new Date();
    vm.currentDate = moment(vm.currentDate).format('YYYY-MM-DD');

    vm.positionStatus = [
      {
        id: 1,
        name: 'position.effective_position'
      },
      {
        id: 2,
        name: 'position.offline_position'
      },
      {
        id: 3,
        name: 'position.expired_position'
      }
    ];

    // get effective resume
    vm.positionTab(1);
    // set page config
    MetaService.pageTitle = vm.$translate.instant('enterprise.position_management');

    // get localStorageService
    vm.companyId = vm.localStorageService.get('company');


    vm.chartSlick = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            arrows: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
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

  }

  // =======================================================Common methods==============================================
  positionTab(id: number) {
    var vm = this;
    vm.changeTabLoading = true;
    vm.positionIndex = id;
    vm.positions = [];
    vm.positionLoading = true;
    vm.filter.search = '';
    switch (id) {
      case 1:
          vm.filter.active = true;
          vm.filter.maxExpiredDate = null;
          vm.filter.minExpiredDate = vm.currentDate;
        break;
      case 2:
        vm.filter.maxExpiredDate = null;
        vm.filter.minExpiredDate = null;
        vm.filter.active = false;
        break;
      case 3:
          vm.filter.active = null;
          vm.filter.minExpiredDate = null;
          vm.filter.maxExpiredDate = vm.currentDate;
            break;
    }

    vm.$timeout(function () {
      vm.changeTabLoading = false;
    }, 1);
  }

  searchPosition() {
    var vm = this;
    vm.changeTabLoading = true;
    vm.positions = [];
    vm.positionLoading = true;
    vm.$timeout(function () {
      vm.changeTabLoading = false;
    }, 1);
  }

  callServer(tableState?: any) {
    var vm = this['$parent']['listCtrl'];
    var params = angular.copy(vm.filter);
    var pagination = tableState['pagination'];
    if (vm.paginationAction === 'prev') {
      params.page = pagination.prev;
    } else if (vm.paginationAction === 'next') {
      params.page = pagination.next;
    }
    vm.tableLoading = true;
    vm.companyPositionService.getPositionByCompany(vm.localStorageService.get('company') ,params, {cache: false}).then(function (result: Array<IPosition>) {
      if (result.length !== 0) {

        _.each(result, function (value: any) {
          value.expiredDate = moment(value.expiredDate).format('YYYY-MM-DD');
          switch(value.salaryType) {
            case 'yearly':
                  value.salaryType = vm.$translate.instant('position.yearly');
                  break;
            case 'monthly':
                  value.salaryType = vm.$translate.instant('position.monthly');
                  break;
            case 'hourly':
              value.salaryType = vm.$translate.instant('position.hourly');
              break;
          }
          value['selected'] = false;
        });
        vm.positions = result;
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
        vm.positionLoading = false;
      }, 100);

    });
  }


  // Delete rowCollection position
  deletePosition(id: string): void {
    var vm = this;
    vm.companyPositionService.destroy(vm.companyId , id).then(function () {
      var index = _.findIndex(vm.positions, {id: id});
      if (index !== -1) {
        vm.positions.splice(index, 1);
      }
      vm.positions = angular.copy(vm.positions);
      vm.toaster.pop('success', '', vm.$translate.instant('message.delete_success_msg'));
    }, function () {
      vm.toaster.pop('error', '', vm.$translate.instant('message.delete_error_msg'));
    });
  }


  // backOnlinePosition rowCollections position
  backOnlinePosition(id: string, type: string): void {
    var vm = this;
    vm.companyPositionService.backOnlinePosition(vm.localStorageService.get('company') , id , {active: true}).then(function (result: IPosition) {
      switch(type) {
        case 'offline':
              vm.positionTab(2);
              break;
        case 'expired':
              vm.positionTab(3);
              break;
      }
      vm.toaster.pop('success', '', vm.$translate.instant('message.back_online_success_msg'));
    }, function (result: any) {
      if (result.data.code === 18003) {
        vm.toaster.pop('error', '', vm.$translate.instant('message.active_jobs_account_insufficient_quantity_error_msg'));
      }

    });
  }


  // Position active false.
  downlinePosition(id: string, type: string): void {
    var vm = this;
    vm.companyPositionService.update(vm.localStorageService.get('company') , id, {active: false}).then(function (result: IPosition) {
      vm.positionTab(1);
      vm.toaster.pop('success', '', vm.$translate.instant('message.downline_success_msg'));
    }, function () {
      vm.toaster.pop('error', '', vm.$translate.instant('message.downline_error_msg'));
    });

  }

  showChart(index: number) {
    var vm = this;
    vm.positions[index]['selected'] = !vm.positions[index]['selected'];
    vm.companyPositionService.getChart(vm.positions[index].id, {}, {cache: false}).then(function (result: any) {
      vm.chartLoading = true;
      vm.positions[index]['candidateNum'] = result.totalCandidates;
      vm.positions[index]['educationChartLabels'] = [];
      vm.positions[index]['educationChartData'] = [];

      vm.positions[index]['experienceChartData'] = [];
      vm.positions[index]['experienceChartLabels'] = [];

      vm.positions[index]['skillChartLabels'] = [];
      vm.positions[index]['skillChartData'] = [];

      vm.positions[index]['schoolChartData'] = [];
      vm.positions[index]['schoolChartLabels'] = [];

      vm.positions[index]['subjectChartData'] = [];
      vm.positions[index]['subjectChartLabels'] = [];

      _.each(result.educationLevels, function (value: any) {
        vm.positions[index]['educationChartLabels'].push(value.name);
        vm.positions[index]['educationChartData'].push(value.value);
      });


        _.each(result.yearOfExperience, function (value: any) {
          vm.positions[index]['experienceChartData'].push(value.value);
          vm.positions[index]['experienceChartLabels'].push(value.name);
        });


        if(result.skills.length > 0) {
          _.each(result.skills, function(value: any, key: number) {
            if(key <= 7) {
              vm.positions[index]['skillChartData'].push(value.sum);
              vm.positions[index]['skillChartLabels'].push(value.name);
            }
          });
          vm.isSkill = true;
        } else {
          vm.isSkill = false;
        }


        if(result.school.length > 0) {
          _.each(result.school, function(value: any, key: number) {
            if(key <= 7) {
              vm.positions[index]['schoolChartData'].push(value.sum);
              vm.positions[index]['schoolChartLabels'].push(value.name);
            }
          });
          vm.isSchool = true;
        } else {
          vm.isSchool = false;
        }


      if(result.subject.length > 0) {
        _.each(result.subject, function(value: any, key: number) {
          if(key <= 7) {
            vm.positions[index]['subjectChartData'].push(value.sum);
            vm.positions[index]['subjectChartLabels'].push(value.name);
          }
        });
        vm.isSubject = true;
      } else {
        vm.isSubject = false;
      }

        vm.chartLoading = false;
      });

  }


}
