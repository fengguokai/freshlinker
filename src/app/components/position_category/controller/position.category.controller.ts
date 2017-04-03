import {PositionCategoryService, IPositionCategory} from '../service/position_category.service';
import {BreadcrumbService, IBread} from '../../breadcrumb/service/breadcrumb.service';
import {IPosition, PositionService, IResponsive} from '../../position/service/position.service';
import {MetaService} from '../../../main/meta.service';
import {ISearch, SearchService} from '../../search/service/search.service';

export class PositionCategoryController {
    public positionCategories: IPositionCategory[] = [];
    // position
    public hotPosition: IPosition[] = [];
    public positionLoading: boolean = false;
    public positionSlick: IResponsive;
    public categoryLoading: boolean = false;
    public filter: ISearch = {};


    /* @ngInject */
    constructor(private positionCategoryService: PositionCategoryService,
                private breadcrumbService: BreadcrumbService,
                private $translate: angular.translate.ITranslateService,
                private positionService: PositionService,
                private MetaService: MetaService,
                private $state: ng.ui.IStateService) {
        // this
        var vm = this;
        vm.positionSlick = positionService.slick;
        vm.categoryLoading = true;
        vm.positionCategoryService.getPositionCategory({}, {cache: false}).then(function (result: IPositionCategory[]) {
            vm.positionCategories = result;
            vm.categoryLoading = false;
        });

        // get hotPosition
        vm.positionLoading = true;
        vm.positionService.get({limit: 12}, {cache: false}).then(function (result: IPosition[]) {
            vm.hotPosition = result;
            vm.positionLoading = false;

        });

        // set breadcrumb
        vm.breadcrumbService.clear();
        vm.breadcrumbService.set({title: vm.$translate.instant('navbar.position_search'), url:'/position-categroies'});

        // set page config
        MetaService.pageTitle = vm.$translate.instant('navbar.position_search');
    }

    search(id: string) {
        var vm = this;
        vm.filter.categoryIds = [id];
        vm.$state.go('main.positions', vm.filter);
    }




}
