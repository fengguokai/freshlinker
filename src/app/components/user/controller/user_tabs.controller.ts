import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
export class UserTabsController {

    public user: string;


    /* @ngInject */
    constructor(private dashboardTabsService: DashboardTabsService
    ) {
        var vm = this;
        vm.user = vm.dashboardTabsService.get();
    }

}



