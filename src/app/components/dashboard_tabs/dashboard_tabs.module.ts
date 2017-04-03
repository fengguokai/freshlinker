import {DashboardTabsController } from './controller/dashboard_tabs.controller';
import {DashboardTabsService} from './service/dashboard_tabs.service';
module frontend {
    'use strict';
    angular.module('frontend')
        .controller('DashboardTabsController', DashboardTabsController)
        .service('dashboardTabsService', DashboardTabsService)
}





