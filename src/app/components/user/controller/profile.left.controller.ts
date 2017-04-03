import {IUser, UserService} from '../service/user.service';
import {AuthService} from '../../auth/service/auth.service';

export class ProfileLeftController {

    public user: IUser;
    /* @ngInject */
    constructor(private authService: AuthService,
                private userService: UserService) {
        var vm = this;
        if(vm.authService.checkUser()) {
            vm.userService.find({}, {cache: false}).then(function(result: IUser) {
                vm.user = result;
            });
        }
    }
}
