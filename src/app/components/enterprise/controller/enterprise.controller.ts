import {DashboardService} from  '../../company_dashboard/service/dashboard.service';
import {ICompany, CompanyService} from  '../../company/service/company.service';
import {IUser,UserService} from '../../user/service/user.service';
import {AuthService} from '../../auth/service/auth.service';
import {MetaService} from '../../../main/meta.service';

export class EnterpriseController {
    public  isShow: boolean = false;
    /* @ngInject */
    constructor(private authService: AuthService,
                private userService: UserService,
                private $state: ng.ui.IStateService,
                private $location: ng.ILocationService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private dashboardService: DashboardService,
                private companyService : CompanyService,
                private MetaService: MetaService) {
        var vm = this;
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.recruitment_platform');

    }

    buyPlan() {
        var vm = this;
        if(vm.authService.checkEnterprise()) {
            vm.$state.go('enterprise-auth.company.plan_package', {companyId: vm.localStorageService.get('company')});
        } else {
            vm.authService.openLoginForm();
        }
    }


}





