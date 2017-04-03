import {RoleService} from './service/role.service';
import {SelectRoleUserController} from './controller/role.user.controller';
import {SelectRolePlanController} from './controller/role.plan.controller';
import {PostController} from './controller/post.controller';
import {CheckRoleService} from './service/checkRole.service';

module frontend {
    'use strict';
    angular.module('frontend')
        .service('roleService', RoleService)
        .controller('SelectRoleUserController', SelectRoleUserController)
        .controller('SelectRolePlanController', SelectRolePlanController)
        .controller('PostController', PostController)
        .service('checkRoleService', CheckRoleService);
}







