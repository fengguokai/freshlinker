import {RoleService, IRole} from '../../role/service/role.service';



export class SelectRoleUserController {
    public post: string;
    /* @ngInject */
    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
        var vm = this;
        vm.post = 'company';
    }


    selectRoleuser() {
        var vm = this;
        vm.$uibModalInstance.close(vm.post);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }


}





