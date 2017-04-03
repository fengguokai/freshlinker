import {ICompany} from '../../company/service/company.service.ts';
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service.ts';
import {MetaService} from '../../../main/meta.service.ts';
import {DashboardService} from '../service/dashboard.service.ts';
import {ICompany} from '../../company/service/company.service.ts';
import {AuthService} from '../../auth/service/auth.service.ts';


export class DashboardLeftController {
    public dashboardLoading: boolean = false;
    public company: ICompany = {};
    public companyId: string;

    public descriptionShow: boolean = false;


    /* @ngInject */
    constructor(private dashboardService: DashboardService,
                private localStorageService: any) {

        var vm = this;
        vm.dashboardLoading = true;
        vm.companyId = vm.localStorageService.get('company');
        if(!_.isNull(vm.companyId)) {
            vm.dashboardService.findCompany(vm.companyId, {}, {cache: false}).then(function(result: ICompany) {
                vm.company = result;
                vm.dashboardLoading = false;
            });
        } else {
            vm.dashboardLoading = false;
        }


    }




}
