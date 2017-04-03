import {ICompany, CompanyService, IStage, IScale} from  '../service/company.service';
import{ICountry,CountryService} from '../service/country.service';
import {AuthService} from '../../auth/service/auth.service';
import {UserService} from '../../user/service/user.service';
import {IUser} from "../../user/service/user.service";
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {UserEducationService} from '../../user/service/user_education.service';
import {MetaService} from '../../../main/meta.service';



export class CompanyFormController {
  public user: Array<IUser>;
  public upload: any;
  public uploadCovers: any;
  public country: ICountry;
  public saveLoading: boolean = false;
  public positionIndex: number = 1;

  public selectedCountry: string;
  public countryShow:boolean = false;

  public files: any;
  public covers: any;

  public companyId: string;

  public cover: string = "";
  public icon: string = "";

  public stages: IStage[] = [];

  public years: number[] = [];
  public myYear: number;

  private company: ICompany = {};
  public loading: boolean = false;

  public isIconError: boolean = false;
  public iconError: string;

  public isCoverError: boolean = false;
  public coverError: string;



  /* @ngInject */
  constructor(private countryService: CountryService,
              private companyService: CompanyService,
              private toaster: ngtoaster.IToasterService,
              private $state: ng.ui.IStateService,
              private $translate: angular.translate.ITranslateService,
              private breadcrumbService: BreadcrumbService,
              private countries: ICountry[],
              private dashboardTabsService: DashboardTabsService,
              private $timeout: angular.ITimeoutService,
              private localStorageService: any,
              private scales: IScale[],
              private userEducationService: UserEducationService,
              private $stateParams: ng.ui.IStateParamsService,
              private MetaService: MetaService) {

    var vm = this;
    MetaService.pageTitle = vm.$translate.instant('enterprise.edit_company_information');
    vm.dashboardTabsService.set('company_message');
    // create date
    vm.years = vm.userEducationService.getYears();

    var myDate = new Date();
    vm.myYear = myDate.getFullYear();

    vm.stages = [
      {
        id: '1',
        value: 'public-company'
      },
      {
        id: '2',
        value: 'educational'
      },
      {
        id: '3',
        value: 'self-employed'
      },
      {
        id: '4',
        value: 'government-agency'
      },
      {
        id: '5',
        value: 'non-profit'
      },
      {
        id: '6',
        value: 'self-owned'
      },
      {
        id: '7',
        value: 'privately-held'
      },
      {
        id: '8',
        value: 'partnership'
      }
    ];

    vm.companyId = localStorageService.get("company");

    vm.loading = true;
    vm.companyService.getCompany($stateParams['companyId'], {}, {cache: false}).then(function(result: any) {
      result.foundingTime = parseInt(result.foundingTime);
      vm.company = result;
      vm.loading = false;
    });
  }

  // =======================================================Common methods==============================================

  addCountry(data: ICountry) {
    var vm = this;
    vm.selectedCountry = data.name;
    vm.company.countryId = data.id;
  }

  // Add/edit company
  save(): void {
    var vm = this;
    vm.saveLoading = true;
    // add data
    var data = angular.copy(vm.company);


      var savePromise = vm.companyService.update(data.id ,data);
      savePromise.then(function (result: any) {
        result.foundingTime = parseInt(result.foundingTime);
        vm.company = result;
        var params = angular.copy(vm.company);
        if(_.isUndefined(vm.covers) && _.isUndefined(vm.files))  {
          vm.saveLoading = false;
          vm.toaster.pop('success', '', vm.$translate.instant('message.company_update_success_msg'));
          // 如果审核通过,将跳转到dashboard画面.
          vm.$state.go('enterprise-auth.company.company-dashboard', {companyId:  vm.companyId});
        } else {
          // Company logo
          if(!_.isUndefined(vm.files)) {
            vm.companyService.uploadPicture(vm.company.id.toString(), vm.files, params).then(function (result: any) {
              vm.company.icon = result;
              vm.saveLoading = false;
              if(!vm.saveLoading) {
                if(!vm.isIconError && !vm.isCoverError) {
                  vm.toaster.pop('success', '', vm.$translate.instant('message.company_update_success_msg'));
                  // 如果审核通过,将跳转到dashboard画面.
                  vm.$state.go('enterprise-auth.company.company-dashboard', {companyId:  vm.companyId});
                }
              }
            }, function(result: any) {
              switch(result.data.validation) {
                case 'dimensions':
                  vm.iconError = vm.$translate.instant('message.user_icon_error_message');
                    vm.toaster.pop('error', '', vm.$translate.instant('message.company_create_success_icon_create_dimensions_error'));
                    vm.$state.go('enterprise-auth.company.company_companies_edit', {companyId: vm.company.id});
                  break;
                case 'image':
                  vm.iconError = vm.$translate.instant('message.user_icon_size_error_message');
                  vm.toaster.pop('error', '', vm.$translate.instant('message.company_create_success_icon_create_size_error'));
                  vm.$state.go('enterprise-auth.company.company_companies_edit', {companyId: vm.company.id});
                  break;
              }

              vm.isIconError = true;
              vm.saveLoading = false;
            });
          }

          if(!_.isUndefined(vm.covers)) {
            vm.companyService.uploadCompanyCover(vm.company.id.toString(), vm.covers, params).then(function (result: any) {
              vm.company.cover = result;
              vm.saveLoading = false;
              if(!vm.saveLoading) {
                if(!vm.isIconError && !vm.isCoverError) {
                  vm.toaster.pop('success', '', vm.$translate.instant('message.company_update_success_msg'));
                  // 如果审核通过,将跳转到dashboard画面.
                  vm.$state.go('enterprise-auth.company.company-dashboard', {companyId:  vm.companyId});
                }
              }
            }, function(result: any) {
              switch(result.data.validation) {
                case 'dimensions':
                  vm.coverError = vm.$translate.instant('message.user_icon_error_message');
                  vm.toaster.pop('error', '', vm.$translate.instant('message.company_create_success_cover_create_dimensions_error'));
                  vm.$state.go('enterprise-auth.company.company_companies_edit', {companyId: vm.company.id});
                  break;
                case 'image':
                  vm.coverError = vm.$translate.instant('message.user_icon_size_error_message');
                  vm.toaster.pop('error', '', vm.$translate.instant('message.company_create_success_cover_create_size_error'));
                  vm.$state.go('enterprise-auth.company.company_companies_edit', {companyId: vm.company.id});
                  break;
              }
              vm.isCoverError = true;
              vm.saveLoading = false;
            });
          }



        }



      }, function (err: any) {
        vm.saveLoading = false;
      });

  }





  // 上传/修改 图片.
  uploadFile(file?: any): any {
    var vm = this;
    vm.files = file;
    if(vm.isIconError) vm.isIconError = false;
  }


  // 上传/修改 封面图.
  uploadCover(file?: any): any {
    var vm = this;
    vm.covers = file;
    if(vm.isCoverError) vm.isCoverError = false;
  }


  return() {
    var vm = this;
    vm.$state.go('enterprise-auth.company.company-dashboard', {companyId:  vm.localStorageService.get('company')});

  }




}
