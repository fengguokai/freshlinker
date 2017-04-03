import {IPost} from '../service/role.service';
export class PostController {
    public post: IPost = {
        firstName: '',
        email: '',
        lastName: ''
    };
    /* @ngInject */
    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
        var vm = this;
    }


    postUser() {
        var vm = this;
        if(vm.post.email !== "" && vm.post.firstName !== "" && vm.post.lastName !== "") vm.$uibModalInstance.close(vm.post);
    }



}





