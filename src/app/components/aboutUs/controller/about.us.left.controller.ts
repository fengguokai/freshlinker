import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
export class AboutUsLeftController {
public about: string;
    /* @ngInject */
    constructor(private dashboardTabsService: DashboardTabsService) {

        var vm = this;
        vm.about = vm.dashboardTabsService.get();

    }




}
