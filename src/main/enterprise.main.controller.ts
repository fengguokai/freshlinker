import {DashboardService} from  '../components/company_dashboard/service/dashboard.service';
import {ICompany, CompanyService} from  '../components/company/service/company.service';
import {IUser,UserService} from '../components/user/service/user.service';
import {AuthService} from '../components/auth/service/auth.service';
import {DashboardService} from '../components/company_dashboard/service/dashboard.service';
import {SelectCompanyController} from '../components/company_dashboard/controller/select.company.controller';
import {PostController} from '../components/role/controller/post.controller';
import {IPost} from '../components/role/service/role.service';
import {EnterpriseService, IEnterprise} from '../components/enterprise/service/enterprise.service';

export class EnterpriseMainController {
  public enterprise: IEnterprise;
  public companies: any;
  public companyExit: boolean = false;
  public companyId: number;
  public currentTranslate: string;

  /* @ngInject */
  constructor(private authService: AuthService,
              private dashboardService: DashboardService,
              private userService: UserService,
              private enterpriseService: EnterpriseService,
              private $state: ng.ui.IStateService,
              private $location: ng.ILocationService,
              private localStorageService: any,
              private auth: any,
              private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService,
              private $log: ng.ILogService,
              private dashboardService: DashboardService,
              private companyService: CompanyService,
              private $timeout: angular.ITimeoutService) {
    var vm = this;
    vm.retrieveEnterprise();
    vm.currentTranslate = vm.localStorageService.get('lang') === null ? 'lang.zh_hk' : vm.localStorageService.get('lang');



  }

  retrieveEnterprise() {
    var vm = this;
    if(vm.localStorageService.get('company') !== null) vm.companyId = vm.localStorageService.get('company');
    if(vm.authService.checkEnterprise()) {
      vm.enterpriseService.find({}, {cache: false}).then(function (result: IUser) {
        vm.enterprise = result;
      });
      if(vm.localStorageService.get('company') !== null)  {
        vm.companyExit = true;
      } else {
        vm.dashboardService.findCompanyByUser({}, {cache: false}).then(function(result: ICompany[]) {
          if(result.length === 1 && result[0].isApproved) {
            vm.$state.go('enterprise-auth.company.company-dashboard', {companyId: result[0].id});
          } else if(result.length > 1) {
            vm.$state.go('enterprise-auth.company.company-select');
          } else if (result.length === 0) {
            vm.$state.go('enterprise-auth.company.apply_for_companies');
          }

        });
      }

    }
  }

  signin(): void {
    this.authService.openLoginForm();
  }

  logout(): void {
    this.authService.logout();
    this.$state.go('fullscreen.home');
  }

  translate(key: string) {
    var vm = this;
    vm.$translate.use(key);
    switch(key) {
      case 'zh-cn':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.zh_cn';
          vm.localStorageService.set('lang', 'lang.zh_cn');
        });
        break;
      case 'zh-hk':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.zh_hk';
          vm.localStorageService.set('lang', 'lang.zh_hk');
        });
        break;
      case 'en-us':
        vm.$timeout(function(){
          vm.currentTranslate = 'lang.en_us';
          vm.localStorageService.set('lang', 'lang.en_us');
        });
        break;
    }
  }

}
