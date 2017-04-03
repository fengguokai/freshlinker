import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {AuthService} from '../../auth/service/auth.service';

export class JobsController {
    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private localStorageService: any,
                private authService: AuthService) {

        var vm = this;
        vm.dashboardTabsService.set('jobs');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('footer.jobs');
    }

    register() {
        var vm = this;
        vm.authService.openSignupForm();
    }

}

