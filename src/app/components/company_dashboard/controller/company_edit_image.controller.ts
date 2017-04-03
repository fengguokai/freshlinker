import {MetaService} from '../../../main/meta.service';
import {CompanyService, ICompany} from '../../company/service/company.service';

export class CompanyEditImageController {
    public saveLoading: boolean = false;
    public upload: any;
    public uploadCovers: any;
    public files: any;
    public covers: any;
    public cover: string = "";
    public icon: string = "";

    public company: ICompany;
    public loading: boolean = false;

    public isIconError: boolean = false;
    public iconError: string;

    public isCoverError: boolean = false;
    public coverError: string;

    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                private $timeout: angular.ITimeoutService,
                private MetaService: MetaService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private companyService: CompanyService,
                private localStorageService: any) {
        var vm = this;


        MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.editIcon');

        vm.loading = true;
        vm.companyService.find(vm.localStorageService.get('company'), {}, {cache: false}).then(function(result: ICompany) {
            vm.company = result;
            if(vm.company.icon !== null) vm.icon = vm.company.icon.url['200'];
            if(vm.company.cover !== null) vm.cover = vm.company.cover.url['480'];
            vm.loading = false;
        });



    }

    // save
    save() {
        var vm = this;
        var params = angular.copy(vm.company);
        vm.saveLoading = true;
        // Company logo
        if(!_.isUndefined(vm.files)) {
            vm.companyService.uploadPicture(vm.company.id.toString(), vm.files, params).then(function (result: any) {
                vm.icon = result.url['200'];
                vm.saveLoading = false;
                if(!vm.saveLoading) {
                    if (!vm.isIconError && !vm.isCoverError) {
                        vm.toaster.pop('success', '', vm.$translate.instant('message.company_image_edit_message'));
                        vm.$uibModalInstance.close(result);
                    }
                }
            }, function(result: any) {
                switch(result.data.validation) {
                    case 'dimensions':
                        vm.iconError = vm.$translate.instant('message.user_icon_error_message');
                        break;
                    case 'image':
                        vm.iconError = vm.$translate.instant('message.user_icon_size_error_message');
                        break;
                }

                vm.isIconError = true;
                vm.saveLoading = false;
            });
        }

        // company cover
        if(!_.isUndefined(vm.covers)) {
            vm.companyService.uploadCompanyCover(vm.company.id.toString(), vm.covers, params).then(function (result: any) {
                vm.cover = result.url['480'];
                vm.saveLoading = false;
                if(!vm.saveLoading) {
                    if (!vm.isIconError && !vm.isCoverError) {
                        vm.toaster.pop('success', '', vm.$translate.instant('message.company_image_edit_message'));
                        vm.$uibModalInstance.close();
                    }
                }
            }, function(result: any) {
                switch(result.data.validation) {
                    case 'dimensions':
                        vm.coverError = vm.$translate.instant('message.user_icon_error_message');
                        break;
                    case 'image':
                        vm.coverError = vm.$translate.instant('message.user_icon_size_error_message');
                        break;
                }

                vm.isCoverError = true;
                vm.saveLoading = false;
            });
        }

    }


    // 上传/修改 图片.
    uploadFile(file?: any): any {
        var vm = this;
        vm.files = file;
        if(vm.isIconError) vm.isIconError = false;
    }


    // 上传/修改 封面图.
    uploadCover(file?: any): any {
        var vm = this;
        vm.covers = file;
        if(vm.isCoverError) vm.isCoverError = false;
    }



    // cancel
    cancel() {
        this.$uibModalInstance.dismiss();
    }

}
