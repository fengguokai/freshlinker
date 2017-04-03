import { IUser, IUpload, UserService, ISkill} from '../service/user.service';
import {MetaService} from '../../../main/meta.service';
import { ICountry } from '../../company/service/country.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IExperience, CompanyPositionService} from '../../company_position/service/company.position.service';

export class UserInfomationController {
    public saveLoading: boolean = false;
    public upload: IUpload;
    public skills: ISkill[] = [];

    public yearOfExperience: IExperience[] = [];
    public companyId: string;

    public user: IUser = {};
    public loading: boolean = false;

    public isError: boolean = false;
    public iconLoading: boolean = false;
    public iconError: string;
    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private userService: UserService,
                private MetaService: MetaService,
                private countries: ICountry[],
                private $state: ng.ui.IStateService,
                private $scope: ng.IScope,
                private dashboardTabsService: DashboardTabsService,
                private $timeout: any,
                private companyPositionService: CompanyPositionService) {
        var vm = this;
        vm.loading = true;
        vm.userService.find({}, {cache: false}).then(function(result: IUser) {
            vm.user = result;
            vm.yearOfExperience = vm.companyPositionService.getExperience();
            if(_.isNull(vm.user.nationalityId)) vm.user.nationalityId = 47;
            if(_.isNull(vm.user.yearOfExperience)) vm.user.yearOfExperience = '0';
            if(_.isNull(vm.user.gender)) vm.user.gender = 'M';
            vm.user.birth = moment(vm.user.birth).toDate();
            vm.loading = false;
        });

        MetaService.pageTitle = vm.$translate.instant('user.profile.my_profile');
        vm.dashboardTabsService.set('profile');
    }


    // save
    save() {
        var vm = this;
        vm.saveLoading = true;
        if (vm.user.skills.length !== 0) {
            vm.skills = vm.user.skills;
            vm.user.skills = [];
            _.each(vm.skills, function (value: ISkill) {
                vm.user.skills.push({name: value.name});
            });
        }
        var data = angular.copy(vm.user);
        data.birth = moment(data.birth).format('YYYY-MM-DD');
        var savePromise = vm.userService.update(data);
        savePromise.then(function (result: IUser) {
            result.birth = moment(result.birth).toDate();
            vm.user = result;
            vm.$scope['$parent']['mainCtrl']['user'] = vm.user;

            if(!vm.iconLoading && !vm.isError) {
                vm.saveLoading = false;
                vm.toaster.pop('success', '', vm.$translate.instant('message.user_profile_person_update_success_msg'));
                vm.$state.go('main-auth.profile');
            }
        }, function (result: any) {
            vm.saveLoading = false;
        });

    }


    // 上传/修改 图片.
    uploadFile(file: any): void {
        var vm = this;
        var data = angular.copy(vm.upload);
        if(vm.saveLoading) vm.saveLoading = false;
        // User logo
        vm.iconLoading = true;
        vm.userService.uploadPicture(file, data).then(function (result: any) {
            vm.iconLoading = false;
            vm.isError = false;
            if(vm.saveLoading) vm.save();
        }, function(result: any) {
            switch(result.data.validation) {
                case 'dimensions':
                    vm.iconError = vm.$translate.instant('message.user_icon_error_message');
                    vm.toaster.pop('error', '', vm.iconError);
                    break;
                case 'image':
                    vm.iconError = vm.$translate.instant('message.user_icon_size_error_message');
                    vm.toaster.pop('error', '', vm.iconError);
                    break;
            }
            vm.$timeout(function() {
                vm.iconLoading = false;
                vm.isError = true;
            }, 500);
        });
    }

}





