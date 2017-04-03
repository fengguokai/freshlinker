import {ICompany, CompanyService} from  '../../company/service/company.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {MetaService} from '../../../main/meta.service';
import {CompanyPlanPackageService, IPlan} from  '../service/company_plan_package.service';

export class CompanyPlanPackageController {
    public companyId: string;
    public checked: string;

    public liteLoading: boolean = false;
    public lite: any = {};

    public standardLoading: boolean = false;
    public standard: any = {};

    public professionLoading: boolean = false;
    public profession: any = {};

    public premiumLoading: boolean = false;
    public premium: any = {};

    public enterpriseLoading: boolean = false;
    public enterprise: any = {};


    /* @ngInject */
    constructor(
        private localStorageService: any,
        private $translate: angular.translate.ITranslateService,
        private MetaService: MetaService,
        private dashboardTabsService: DashboardTabsService,
        private planService: CompanyPlanPackageService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get('company');
        vm.dashboardTabsService.set('upgrade');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.upgrade');

        vm.liteLoading = true;
        vm.planService.getPublicPlan('2', {cache: false}).then(function(result: any) {
            vm.lite.displayName = result.displayName;
            vm.lite.description = result.description;
            vm.lite.oldPrice = result.meta.oldPrice;
            vm.lite.price = result.meta.price;
            vm.lite.positionQuota = result.meta.positionQuota;
            vm.lite.planEffectiveDay = result.meta.planEffectiveDay;
            vm.lite.interview = result.meta.interview;
            vm.lite.facebookPage = result.meta.facebookPage;
            vm.liteLoading = false;
        });

        vm.standardLoading = true;
        vm.planService.getPublicPlan('3', {cache: false}).then(function(result: any) {
            vm.standard.displayName = result.displayName;
            vm.standard.description = result.description;
            vm.standard.oldPrice = result.meta.oldPrice;
            vm.standard.price = result.meta.price;
            vm.standard.positionQuota = result.meta.positionQuota;
            vm.standard.planEffectiveDay = result.meta.planEffectiveDay;
            vm.standard.interview = result.meta.interview;
            vm.standard.facebookPage = result.meta.facebookPage;
            vm.standardLoading = false;
        });


        vm.professionLoading = true;
        vm.planService.getPublicPlan('4', {cache: false}).then(function(result: any) {
            vm.profession.displayName = result.displayName;
            vm.profession.description = result.description;
            vm.profession.oldPrice = result.meta.oldPrice;
            vm.profession.price = result.meta.price;
            vm.profession.positionQuota = result.meta.positionQuota;
            vm.profession.planEffectiveDay = result.meta.planEffectiveDay;
            vm.profession.interview = result.meta.interview;
            vm.profession.facebookPage = result.meta.facebookPage;
            vm.professionLoading = false;
        });

        vm.premiumLoading = true;
        vm.planService.getPublicPlan('5', {cache: false}).then(function(result: any) {
            vm.premium.displayName = result.displayName;
            vm.premium.description = result.description;
            vm.premium.oldPrice = result.meta.oldPrice;
            vm.premium.price = result.meta.price;
            vm.premium.positionQuota = result.meta.positionQuota;
            vm.premium.planEffectiveDay = result.meta.planEffectiveDay;
            vm.premium.interview = result.meta.interview;
            vm.premium.facebookPage = result.meta.facebookPage;
            vm.premiumLoading = false;
        });


        vm.enterpriseLoading = true;
        vm.planService.getPublicPlan('6', {cache: false}).then(function(result: any) {
            vm.enterprise.displayName = result.displayName;
            vm.enterprise.description = result.description;
            vm.enterpriseLoading = false;
        });

    }








}





