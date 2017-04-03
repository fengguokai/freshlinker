import {DashboardService} from  '../../company_dashboard/service/dashboard.service';
import {ICompany} from "../../company/service/company.service";

export class RemoveSavePositionController {
    public isCheck: boolean = false;
    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
        //
    }

    check() {
        var vm = this;
        vm.isCheck = true;
        vm.$uibModalInstance.close(vm.isCheck);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }


}





