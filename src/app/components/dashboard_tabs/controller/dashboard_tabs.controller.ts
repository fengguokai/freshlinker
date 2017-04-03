import {DashboardTabsService} from '../service/dashboard_tabs.service';
export class DashboardTabsController {

public companyId: string;
    public dashboard: string;

    /* @ngInject */
    constructor(private localStorageService: any,
                private dashboardTabsService: DashboardTabsService
    ) {
        var vm = this;
        vm.companyId = vm.localStorageService.get('company');
        vm.dashboard = vm.dashboardTabsService.get();
    }

}

