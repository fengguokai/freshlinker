import {IUser, UserService} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';

export class ProfileFormIconController {
    public saveLoading: boolean = false;
    public upload: any;
    public files: any;
    public isError: boolean = false;
    public iconError: string;
    public iconLoading: boolean = false;

    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                private userService: UserService,
                private icon: any,
                private $timeout: angular.ITimeoutService,
                private MetaService: MetaService) {
        var vm = this;


        MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.editIcon');

    }

    // save
    save() {
        var vm = this;
        var data = angular.copy(vm.upload);
        vm.saveLoading = true;
        if(!_.isUndefined(vm.files)) {
            vm.iconLoading = true;
            var savePromise = vm.userService.uploadPicture(vm.files, data);
            savePromise.then(function (result: any) {
                vm.toaster.pop('success', '', vm.$translate.instant('message.company_image_edit_message'));
                vm.$uibModalInstance.close(result);
                vm.isError = false;
                vm.saveLoading = false;
                vm.iconLoading =false;
            }, function (result: any) {

                switch(result.data.validation) {
                    case 'dimensions':
                        vm.iconError = vm.$translate.instant('message.user_icon_error_message');
                        break;
                    case 'image':
                        vm.iconError = vm.$translate.instant('message.user_icon_size_error_message');
                        break;
                }
                vm.$timeout(function() {
                    vm.isError = true;
                    vm.saveLoading = false;
                    vm.iconLoading =false;
                }, 500);
            });
        }


    }


    // 上传/修改 图片.
    uploadFile(file?: any): any {
        var vm = this;
        vm.files = file;
        if(vm.isError) vm.isError = false;
    }


    // cancel
    cancel() {
        this.$uibModalInstance.dismiss();
    }

}
