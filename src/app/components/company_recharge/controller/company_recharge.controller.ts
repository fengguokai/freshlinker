import {CreditService, ICredit} from '../../credit_card/service/credit.service';
import {IEnterprise, EnterpriseService} from '../../enterprise/service/enterprise.service';
import {CompanyRechargeService} from '../../company_recharge/service/company_recharge.service';
import {MetaService} from '../../../main/meta.service';

export class CompanyRechargeController {
    public companyId: string;
    public money: number = 0;
    public defaultCredit: ICredit;
    public myDate: Date;

    public saveLoading: boolean = false;

    public loading: boolean = false;
    public credits: ICredit[] = [];

    public enterprise: IEnterprise = {};
    public tableLoading: boolean = false;

    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private localStorageService: any,
                private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private creditService: CreditService,
                private $timeout: ng.ITimeoutService,
                private enterpriseService: EnterpriseService,
                private rechargeService: CompanyRechargeService,
                private MetaService: MetaService) {
        var vm = this;
         MetaService.pageTitle = vm.$translate.instant('enterprise.recharge_account');
        vm.companyId = vm.localStorageService.get('company');
        vm.myDate = new Date();


        vm.loading = true;
        vm.creditService.get({}, {cache: false}).then(function(result: ICredit[]) {
            vm.credits = result;
            vm.checkDefault(vm.credits);
            vm.loading = false;
        });


        vm.tableLoading = true;
        vm.enterpriseService.find({}, {cache: false}).then(function(result: IEnterprise) {
            vm.enterprise = result;
            vm.tableLoading = false;
        });

    }

    checkDefault(credits: ICredit[]) {
        var vm = this;
        if(credits.length === 0) {
            vm.toaster.pop('error', '', vm.$translate.instant('message.credit_card_add_default'));
            vm.$state.go('enterprise-auth.company.credit_card', {companyId: vm.companyId});
        } else {
            _.each(credits, function(val: ICredit) {
                if(val.default_source) vm.defaultCredit = val;
            });
        }
    }

    save() {
        var vm = this;
        vm.saveLoading = true;
        vm.rechargeService.recharger({'amount': vm.money}).then(function(result: any) {
            vm.toaster.pop('success', '', vm.$translate.instant('message.credit_card_recharge_success'));
            vm.saveLoading = false;
            vm.$state.go('enterprise-auth.company.recharge-confirm', {companyId: vm.companyId});
        });

    }


}





