import {UserService} from '../../user/service/user.service';

export class CheckRoleService {
    public isUser: boolean = false;
    public isCompany: boolean = false;
    public isCheck: boolean = false;
    /* @ngInject */
    constructor(private Restangular: any,
                private userService: UserService) {
        //
    }

    checkRole(check: boolean) {
        var vm = this;
        var initPromise = [];
        var checkEnterprisePromise = vm.userService.checkEnterprise({}, {cache: false}).then(function (result: any) {
            vm.isCompany = result.isActivated;
        });
        initPromise.push(checkEnterprisePromise);
        var checkUserPromise = vm.userService.checkUser({}, {cache: false}).then(function (result: any) {
            vm.isUser = result.isActivated;
        });
        initPromise.push(checkUserPromise);
        Promise.all(initPromise).then(function() {
            if((vm.isUser === false && vm.isCompany === false) || vm.isUser === true) {
                check = true;
            } else if(vm.isCompany === true) {
                check = true;
            }
        });
    }




}
