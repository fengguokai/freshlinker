import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {AuthService} from '../../auth/service/auth.service';

export class AboutUsController {
    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private dashboardTabsService: DashboardTabsService,
                private localStorageService: any,
                private authService: AuthService) {

        var vm = this;
        vm.dashboardTabsService.set('about');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('about_us.about');
    }


    downLoad(url: string) {
        var vm = this;
        if(vm.localStorageService.get('token') === null) {
            vm.authService.openLoginForm();
        } else {
            window.open(url);
        }
    }



}
