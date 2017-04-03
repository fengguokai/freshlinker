import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {AuthService} from '../../auth/service/auth.service';

export class CareerController {
    public closeOther: boolean = true;
    public contentOpenOne: boolean = true;

    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private localStorageService: any,
                private authService: AuthService) {

        var vm = this;
        vm.dashboardTabsService.set('career');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('about_us.job');
    }

}
