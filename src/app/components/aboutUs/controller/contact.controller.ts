import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';


export class ContactController {



    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService) {

        var vm = this;
        vm.dashboardTabsService.set('contact');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('contact_us.contact_us');
    }




}
