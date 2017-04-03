import {MetaService} from '../../../main/meta.service';
import {CreditService, ICredit} from '../../credit_card/service/credit.service';

export class CreditCardController {
    public companyId: string;
    public credits: ICredit[] = [];
    public loading: boolean = false;

    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $timeout: ng.ITimeoutService,
                private $state: ng.ui.IStateService,
                private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private $stateParams: ng.ui.IStateParamsService,
                private localStorageService: any,
                private $scope: ng.IScope,
                private creditService: CreditService) {
        var vm = this;
        vm.companyId = vm.localStorageService.get();
        vm.companyId = vm.localStorageService.get('company');
        MetaService.pageTitle = vm.$translate.instant('enterprise.credit');
        vm.loading = true;
        vm.creditService.get({}, {cache: false}).then(function(result: ICredit[]) {
            vm.credits = result;
            vm.loading = false;
        });
    }

    submit() {
        var vm = this;
        return function (token) {
            var data = {paymentToken: token.id};
            vm.loading = true;
            vm.creditService.store(data).then(function (result: any) {
                var index = _.findIndex(result, {id: result.id});
                if(index === -1) vm.credits.push(result);
                vm.loading = false;
            });
        }

    }

    setDefaultCredit(id: string) {
        var vm = this;
        vm.loading = true;
        vm.creditService.setDefaultCredit(id).then(function(result: ICredit) {
            _.each(vm.credits, function(val: ICredit) {
                if(id === val.id) {
                    val.default_source = true;
                } else {
                    val.default_source = false;
                }
            });
            vm.loading = false;
            vm.toaster.pop('success', '', vm.$translate.instant('message.credit_card_set_default'));
        });
    }

    destory(id: string) {
        var vm = this;
        vm.loading = true;
        var index = _.findIndex(vm.credits, {id :id});
        vm.creditService.destroy(id).then(function(result: ICredit) {
            vm.credits.splice(index, 1);
            vm.loading = false;
        });
    }

}

