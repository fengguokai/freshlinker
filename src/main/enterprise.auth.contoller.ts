import {DashboardService} from  '../components/company_dashboard/service/dashboard.service';
import {ICompany, CompanyService} from  '../components/company/service/company.service';
import {IUser,UserService} from '../components/user/service/user.service';
import {AuthService} from '../components/auth/service/auth.service';
import {DashboardService} from '../components/company_dashboard/service/dashboard.service';
import {SelectCompanyController} from '../components/company_dashboard/controller/select.company.controller';
import {RoleService, IRole} from '../components/role/service/role.service';
import {SelectRoleUserController} from '../components/role/controller/role.user.controller';
import {SelectRolePlanController} from '../components/role/controller/role.plan.controller';
import {PostController} from '../components/role/controller/post.controller';
import {IPost} from '../components/role/service/role.service';
import {EnterpriseService, IEnterprise} from '../components/enterprise/service/enterprise.service';


export class EnterpriseAuthController {
  public companies: ICompany[] = [];
  public enterprise: IEnterprise;
  public companyId: string;
  public currentTranslate: string;
  public companyExit: boolean = false;

  /* @ngInject */
  constructor(private authService: AuthService,
              private dashboardService: DashboardService,
              private userService: UserService,
              private $state: ng.ui.IStateService,
              private $location: ng.ILocationService,
              private localStorageService: any,
              private auth: any,
              private toaster: ngtoaster.IToasterService,
              private $translate: angular.translate.ITranslateService,
              private $uibModal: angular.ui.bootstrap.IModalService,
              private $log: ng.ILogService,
              private dashboardService: DashboardService,
              private roleService: RoleService,
              private companyService: CompanyService,
              private $timeout: angular.ITimeoutService,
              private enterpriseService: EnterpriseService) {
    var vm = this;
    vm.retrieveEnterprise();
    if(vm.localStorageService.get('company') !== null) vm.companyId = vm.localStorageService.get('company');
    vm.currentTranslate = vm.localStorageService.get('lang') === null ? 'lang.zh_hk' : vm.localStorageService.get('lang');
  }
  retrieveEnterprise() {
    var vm = this;
    if(vm.authService.checkEnterprise()) {
      vm.enterpriseService.find({}, {cache: false}).then(function (result: IUser) {
        vm.enterprise = result;
      });
      if(vm.localStorageService.get('company') !== null)  {
        vm.companyExit = true;
        vm.companyId = vm.localStorageService.get('company');
      } else {
        vm.dashboardService.findCompanyByUser({}, {cache: false}).then(function(result: ICompany[]) {
          if(result.length === 1 && result[0].isApproved) {
            vm.$state.go('enterprise-auth.company.company-dashboard', {companyId: result[0].id});
            vm.companyId = result[0].id;
            vm.localStorageService.set('company', result[0].id);
          } else if(result.length > 1) {
            vm.$state.go('enterprise-auth.company.company-select');
          } else if (result.length === 0) {
            vm.$state.go('enterprise-auth.company.apply_for_companies');
          }
        });
      }

    }
  }

  logout(): void {
    var vm = this;
    vm.authService.logout();
    vm.$state.go('enterprise.enterprise_show');
  }


  signin(): void {
    this.authService.openLoginForm();
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
