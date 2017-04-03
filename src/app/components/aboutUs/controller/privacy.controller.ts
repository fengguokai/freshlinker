import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';


export class PrivacyController {



    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService) {

        var vm = this;
        vm.dashboardTabsService.set('privacy');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('about_us.privacy');
    }




}
