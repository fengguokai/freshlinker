import {RoleService, IRole} from '../../role/service/role.service';


export class SelectRolePlanController {
    public post: string;
    /* @ngInject */
    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
        var vm = this;
    }


    selectRoleplan() {
        var vm = this;
        vm.$uibModalInstance.close(vm.post);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }


}





