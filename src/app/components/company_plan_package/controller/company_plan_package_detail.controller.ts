import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service.ts';
import {MetaService} from '../../../main/meta.service.ts';
import {CompanyPlanPackageService, IPlan} from  '../service/company_plan_package.service';
import {CreditService} from '../../credit_card/service/credit.service.ts';
import {IEnterprise, EnterpriseService} from '../../enterprise/service/enterprise.service';

export interface IPlanInfo {
    id: string;
    name: string;
    price: string;
}

export class CompanyPlanPackageDetailController {
    public companyId: string;
    public planInfo: any = {};
    public loading: boolean = false;

    public enterprise: IPlan = {};
    public tableLoading: boolean = false;

    public myDate: Date;
    public saveLoading: boolean = false;

    public planNum: string[] = ['2','3','4','5'];
    public plans: IPlanInfo[] = [];

    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private planService: CompanyPlanPackageService,
                private creditService: CreditService,
                private $stateParams: ng.ui.IStateParamsService,
                private enterpriseService: EnterpriseService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get('company');
        vm.myDate = new Date();
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.upgrade');

        vm.loading = true;
        vm.planService.getPlan(vm.$stateParams['plan'], {cache: false}).then(function(result: any) {
            vm.planInfo.id = result.id;
            vm.planInfo.planEffectiveDay = result.meta.planEffectiveDay;
            vm.planInfo.positionQuota = result.meta.positionQuota;
            vm.planInfo.oldPrice = result.meta.oldPrice;
            vm.planInfo.price = result.meta.price;
            vm.planInfo.displayName = result.displayName;
            vm.planInfo.interview = result.meta.interview;
            vm.planInfo.facebookPage = result.meta.facebookPage;
            vm.loading = false;
        });

        vm.tableLoading = true;
        vm.enterpriseService.find({}, {cache: false}).then(function(result: IEnterprise) {
            vm.enterprise = result;
            vm.tableLoading = false;
        });

        _.each(vm.planNum, function(value: string) {
            vm.planService.getPlan(value, {cache: false}).then(function(result: any) {
                var index = _.findIndex(vm.plans, {'id': result.id});
                if(index === -1) vm.plans.push({id: result.id, name: result.displayName, price: result.meta.price});
            });
        });

    }


    setPlan(id: string) {
        var vm = this;
        vm.loading = true;
        vm.planService.getPlan(id, {cache: false}).then(function(result: any) {
            vm.planInfo.planEffectiveDay = result.meta.planEffectiveDay;
            vm.planInfo.positionQuota = result.meta.positionQuota;
            vm.planInfo.oldPrice = result.meta.oldPrice;
            vm.planInfo.price = result.meta.price;
            vm.planInfo.displayName = result.displayName;
            vm.planInfo.id = id;
            vm.planInfo.interview = result.meta.interview;
            vm.planInfo.facebookPage = result.meta.facebookPage;
            vm.loading = false;
        });
    }

    submit(price: string) {
        var vm = this;
        vm.saveLoading = true;
        if(price > vm.enterprise.balance) {
            vm.toaster.pop('error', '', vm.$translate.instant('message.credit_card_balance_no'));
            vm.$state.go('enterprise-auth.company.recharge', {companyId: vm.companyId});
            vm.saveLoading = false;
        } else {
            vm.creditService.buyPlan({'planId': vm.planInfo.id}).then(function(result: any) {
                vm.toaster.pop('success', '', vm.$translate.instant('message.credit_card_balance_success'));
                vm.$state.go('enterprise-auth.company.company-dashboard', {companyId: vm.companyId});
                vm.saveLoading = false;
            }, function (error: any) {
                if(error.data.code === 40021) {
                    vm.toaster.pop('error', '', vm.$translate.instant('message.company_plan_package_not_buy_twice'));
                    vm.saveLoading = false;
                }
            });

        }
    }







}





