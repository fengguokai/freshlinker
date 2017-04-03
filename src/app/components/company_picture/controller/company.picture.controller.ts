import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {CompanyPictureService} from '../service/company.picture.service';
import {IPicture} from '../../company/service/company.service';

export class CompanyPictureController {
    public tableLoading: boolean = false;
    public companyId: string;
    public pictureLoading: boolean = false;
    public pictureSlick: any;
    public editPicture: boolean = false;
    public pictures: any = [];
    public loadPictures: IPicture[] = [];

    public files: any;

    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private $state: any,
                private dashboardTabsService: DashboardTabsService,
                private localStorageService: any,
                private $location: ng.ILocationService,
                private $timeout: any,
                private companyPictureService: CompanyPictureService,
                private $stateParams: any,
                private toaster: ngtoaster.IToasterService,
                private Lightbox: any) {

        var vm = this;
        vm.dashboardTabsService.set('dashboard');
        vm.companyId = vm.localStorageService.get('company');

        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.edit_picture');

        vm.pictureLoading = true;
        vm.companyPictureService.getCompanyPictures(vm.$stateParams['companyId'], {}, {cache:false}).then(function(result: any) {
            vm.pictures = result;
            _.each(vm.pictures, function(value: any) {
                var index = _.findIndex(vm.loadPictures, {id: value.id});
                if(index === -1) vm.loadPictures.push({'id': value.id, 'thumbUrl': value.url['600'],'url': value.url['1024']});
            });
            vm.pictureLoading = false;
        })

    }

    uploadFiles(files?: any): any {
        var vm = this;
        vm.pictureLoading = true;
        var params = angular.copy(vm.companyId);
        _.each(files, function(val: any) {
            vm.companyPictureService.uploadCompanyPicture(vm.companyId, [val], params).then(function (result: any) {
                vm.pictures.push(result);
                _.each(vm.pictures, function(value: any) {
                    var index = _.findIndex(vm.loadPictures, {id: value.id});
                    if(index === -1) vm.loadPictures.push({'id': value.id, 'thumbUrl': value.url['600'],'url': value.url['1024']});
                });
                vm.pictureLoading = false;
            }, function(result: any) {
                switch(result.data.validation) {
                    case 'dimensions':
                        vm.toaster.pop('error', '', vm.$translate.instant('message.icon_dimensions_error_message'));
                        vm.pictureLoading = false;
                        break;
                    case 'image':
                        vm.toaster.pop('error', '', vm.$translate.instant('message.icon_size_error_message'));
                        vm.pictureLoading = false;
                        break;
                }
            });
        });

    }

    destory(id: string) {
        var vm = this;
        vm.pictureLoading = true;
        var index = _.findIndex(vm.pictures, {id: id});
        vm.companyPictureService.destroy(vm.companyId, id).then(function(result: any) {
            vm.pictures.splice(index, 1);
            vm.loadPictures.splice(index, 1);
            vm.pictureLoading = false;
        });
    }

    openLightboxModal(index : number) {
        var vm = this;
        vm.Lightbox.openModal(vm.loadPictures, index);
    }


}
