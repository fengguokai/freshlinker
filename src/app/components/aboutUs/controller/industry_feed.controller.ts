import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {AuthService} from '../../auth/service/auth.service';

export class IndustryFeedController {
    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private authService: AuthService) {

        var vm = this;
        // set page config
        MetaService.pageTitle = vm.$translate.instant('footer.industry_feed');
    }

    goSignUp() {
        this.authService.openSignupForm();
    }

}