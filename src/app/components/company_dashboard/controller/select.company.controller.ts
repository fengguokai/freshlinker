import {ICompany} from "../../company/service/company.service";
import {MetaService} from '../../../main/meta.service';
import {DashboardService} from '../../company_dashboard/service/dashboard.service';

export class SelectCompanyController {

    public companies: ICompany[] = [];
    public loading: boolean = false;

    /* @ngInject */
    constructor(private $translate: angular.translate.ITranslateService,
                private $state: any,
                private localStorageService: any,
                private MetaService: MetaService,
                private dashboardService: DashboardService) {
        var vm = this;
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.load_company');
        vm.loading = true;
        vm.dashboardService.findCompanyByUser({}, {cache: false}).then(function(result: ICompany[]) {
            vm.companies = result;
            vm.loading= false;
        });

    }

    selectCompany(company: ICompany) {
        var vm = this;
        if (company.isApproved) {
            vm.localStorageService.set('company', company.id);
            vm.$state.go('enterprise-auth.company.company-dashboard', {companyId: company.id});
        } else {
            vm.$state.go('enterprise-auth.company.prompt', {companyId: company.id});
        }

    }



}





