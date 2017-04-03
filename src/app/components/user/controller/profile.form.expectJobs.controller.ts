import {IUser} from '../service/user.service.ts';
import {UserExpectService, IExpect} from '../service/user_expectJobs.service';
import {MetaService} from '../../../main/meta.service';
import {PositionService, IPosition, IJobNature} from '../../position/service/position.service';
import {LocationService, ILocation} from '../../location/service/location.service';
import {PositionCategoryService, IPositionCategory} from '../../position_category/service/position_category.service';
import {IPosition,IPositionCategory, CompanyPositionService} from  '../../company_position/service/company.position.service';

export class ProfileFormExpectController {
    public locations: ILocation[] = [];
    public saveLoading: boolean = false;

    public positionLocationSelected: any = {};
    public positionLocationChildren: any = [];
    public selectedPositionLocation: any;
    public selectedPositionLocationId: any = [];
    public locationShow: boolean = false;
    public negotiation: boolean = false;

    public positionCategory: IPositionCategory;
    public positionCategorySelected: any = [];
    public positionCategoryChildren: IPositionCategory[] = [];
    public selectedPositionCategory: IPositionCategory;
    public categoryShow: boolean = false;


    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                private userExpectService: UserExpectService,
                private user: IUser,
                private expect: IExpect,
                private MetaService: MetaService,
                private positionService: PositionService,
                private locationService: LocationService,
                private positionCategoryService: PositionCategoryService,
                private jobNatures: IJobNature[]) {
        var vm = this;
        vm.expect = _.isEmpty(vm.expect) ? vm.userExpectService.init() : vm.expect;

        if (vm.expect.minSalary === 0 && vm.expect.maxSalary === 0) {
            vm.negotiation = true;
            vm.expect.minSalary = null;
            vm.expect.maxSalary = null;
        }

        MetaService.pageTitle = vm.$translate.instant('user.profile.user_profile') + '-' + vm.$translate.instant('user.profile.expectPosition');

        var initPromise = [];
        var initCategoryPromise = [];

        var getPositionCategoryPromise = vm.positionCategoryService.getPositionCategory({}, {cache: false}).then(function (result: IPositionCategory) {
            vm.positionCategory = result;

        });

        initCategoryPromise.push(getPositionCategoryPromise);

        var getLocationPromise = vm.locationService.getLocationTree({cache: false}).then(function (result: ILocation[]) {
            vm.locations = result;
        });

        initPromise.push(getLocationPromise);



        if (vm.expect.id !== "") {
            vm.locationShow = true;
            var getCurrentLocation = vm.locationService.find(vm.expect.locationId, {}, {cache: false}).then(function (result: any) {
                vm.positionLocationSelected = result;
            });

            initPromise.push(getCurrentLocation);

            vm.categoryShow = true;
            var getCurrentCategory = vm.positionCategoryService.find(vm.expect.expectPositionId, {}, {cache:false}).then(function(result: any) {
                vm.positionCategorySelected = result;
            });
            initCategoryPromise.push(getCurrentCategory);
        }


        Promise.all(initPromise).then(function (result) {
            vm.setSelectedPositionLocation(vm.locations, null);
        });

        Promise.all(initCategoryPromise).then(function (result) {
            vm.setSelectedPositionCategory(vm.positionCategory, null);
        });




    }

    // category


    togglePositionCategory(data: any) {
        var vm = this;
        if (!_.isUndefined(data.children)) {
            _.each(vm.positionCategory, function (value: IPositionCategory) {
                if (_.isEqual(value, data)) {
                    data.selected = true;
                } else {
                    value['selected'] = false;
                }
            });
            vm.positionCategoryChildren = data.children;
        }
    }


    addSelectedPositionCategory(data: IPositionCategory) {
        var vm = this;
        vm.selectedPositionCategory = data;
    }

    setSelectedPositionCategory(children: any, parent: any) {
        var vm = this;
        angular.forEach(children, function (child: any) {
            child.parent = parent;
            if (vm.positionCategorySelected.id === child.id) {
                child.selected = true;
                vm.selectedPositionCategory = child;
                if (!_.isUndefined(parent) && !_.isNull(parent)) {
                    vm.togglePositionCategory(child.parent);
                }
            } else {
                child.selected = false;
            }
            if (!_.isUndefined(child.children)) vm.setSelectedPositionCategory(child.children, child);
        });
    }


    // location
    togglePositionLocation(data: any) {
        var vm = this;
        if (!_.isUndefined(data.children)) {
            _.each(vm.locations, function (value: ILocation) {
                if (_.isEqual(value, data)) {
                    data.selected = true;
                } else {
                    value['selected'] = false;
                }
            });
            vm.positionLocationChildren = data.children;
        }
    }

    addSelectedPositionLocation(data: any) {
        var vm = this;
        vm.selectedPositionLocation = data;
    }

    setSelectedPositionLocation(children: any, parent: any) {
        var vm = this;
        angular.forEach(children, function (child: any) {
            child.parent = parent;
            if (vm.positionLocationSelected.id === child.id) {
                child.selected = true;
                vm.selectedPositionLocation = child;
                if (!_.isUndefined(parent) && !_.isNull(parent)) {
                    vm.togglePositionLocation(child.parent);
                }
            } else {
                child.selected = false;
            }
            if (!_.isUndefined(child.children)) vm.setSelectedPositionLocation(child.children, child);
        });
    }

    // save
    save() {
        var vm = this;
        vm.saveLoading = true;
        if(!_.isUndefined(vm.selectedPositionLocation)) {
            vm.expect.locationId = vm.selectedPositionLocation.id;
            if(!_.isUndefined(vm.selectedPositionCategory)) {
                vm.expect.expectPositionId = vm.selectedPositionCategory.id;
                if (vm.negotiation) {
                    vm.expect.maxSalary = 0;
                    vm.expect.minSalary = 0;
                }
                var data = angular.copy(vm.expect);
                var savePromise = data.id === '' ? vm.userExpectService.store(data) : vm.userExpectService.update(data.id, data);

                savePromise.then(function (result: IExpect) {
                    data = result;
                    vm.toaster.pop('success', '', vm.$translate.instant(data.id === '' ? 'message.user_profile_expect_create_success_msg' : 'message.user_profile_expect_update_success_msg'));
                    vm.saveLoading = false;
                    vm.$uibModalInstance.close(result);
                }, function (result: any) {
                    vm.saveLoading = false;
                });
            } else {
                vm.toaster.pop('error', '', vm.$translate.instant('message.category_input_msg'));
                vm.saveLoading = false;
            }
        } else {
            vm.toaster.pop('error', '', vm.$translate.instant('message.location_input_msg'));
            vm.saveLoading = false;
        }
    }

    // cancel
    cancel() {
        this.$uibModalInstance.dismiss();
    }


}
