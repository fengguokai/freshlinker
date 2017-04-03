import {PositionService, IPosition, IJobNature} from '../../position/service/position.service';
import {ArticleService, IArticle} from '../../article/service/article.service';
import {PositionCategoryService, IPositionCategory} from '../../position_category/service/position_category.service';
import {CompanyService, ICompany} from '../../company/service/company.service';
import {ISearch, SearchService} from '../service/search.service';
import {IEducationLevel, EducationLevelService} from '../../education_level/service/education_level.service';
import {LocationService, ILocation} from '../../location/service/location.service';

interface IRange {
    minMonthValue?: number;
    maxMonthValue?: number;
    floor?: number;
    ceil?: number;
    step?: number;
    minRange?: number;
    maxRange?: number;
    options?: any;
}

export class SearchController {
    public positions: IPosition[];

    public companies: ICompany[];
    public selected = undefined;
    public searchCategoryTextShow: boolean = true;


    public filter: ISearch = {};
    public filterOld: ISearch;
    public category: IPositionCategory;
    public posititonCategoryId: IPositionCategory[] = [];
    public searchCategory: IPositionCategory[] = [];



    public openedCategories: any = [];
    public selectedCategories: any = [];

    public search_query: string = '';

    public article_query: string;

    public searchResultNum: number;

    // search
    public searchShow: boolean = false;
    public searchShowMore: boolean = false;
    public showInvalidMessage = false;

    public searchIndex: number = 1;

    // salary
    public salarySlider: IRange;
    public salaryShow: boolean = false;
    public salaryTextShow: boolean = false;

    public monthSalary: boolean = true;
    public hourSalary: boolean = false;

    // educationLevel

    public educationTextShow: boolean = true;

    public selectedEducation: IEducationLevel[] = [];
    public selectedEducationId: IEducationLevel[] = [];
    public selectedEducationLimitShow: boolean = false;
    public selectedEducationTextShow: boolean = true;

    // experience
    public experience: IRange;

    // location

    public searchLocationTextShow: boolean = true;
    public searchShow: any = {
        'positionText': false,
        'category': false,
        'salary': false,
        'education': false,
        'location': false,
        'experience': false,
        'employment': false,
        'jobNature': false
    };


    public fromDriectiveData: any = {
        'categoryIds': [],
        'locationIds': [],
        'educationLevelIds': []
    };



    // education
    public defaultEducationLevelIds: any = [];
    public selectedEducationLevel: any = [];
    public educationLevel: IEducationLevel[];

    // location
    public defaultLocationIds: any = [];
    public selectedLocations: any = [];
    public locations: ILocation[] = [];

    // category
    public defaultPositionCategoryIds: any = [];
    public selectedPositionCategories: any = [];
    public positionCategories: IPositionCategory[] = [];
    public selectedShowType;

    // IJobNature
    public jobNatures: IJobNature[];
    public selectedJobNature: IJobNature;


    /* @ngInject */
    constructor(private positionService: PositionService,
                private $state: ng.ui.IStateService,
                private articleService: ArticleService,
                private $location: ng.ILocationService,
                private positionCategoryService: PositionCategoryService,
                private companyService: CompanyService,
                private searchService: SearchService,
                private $stateParams: ng.ui.IStateParamsService,
                private educationLevelService: EducationLevelService,
                private $timeout: any,
                private locationService: LocationService,
                private $translate: angular.translate.ITranslateService) {

        var vm = this;
        if($location.path() === '/position-categroies') {
            vm.searchIndex = 2;
        }
        // salary
        vm.salarySlider = {
            monthOptions: {
                floor: 0,
                ceil: 100000,
                step: 1000,
                translate: function (value) {
                    if (value === 100000) {
                        return '$' + value + '+';
                    } else {
                        return '$' + value;
                    }
                }
            },
            hourOptions: {
                floor: 0,
                ceil: 500,
                step: 50,
                translate: function (value) {
                    if (value === 500) {
                        return '$' + value + '+';
                    } else {
                        return '$' + value;
                    }
                }
            }
        };

        vm.experience = {
            startExperience: 0,
            endExperience: 5,
            options: {
                floor: 0,
                ceil: 5,
                step: 1,
                showSelectionBar: true,
                translate: function (value) {
                    if (value === 5) {
                        return value + '+';
                    } else {
                        return value;
                    }
                }

            }
        };

        vm.initFilter();

        vm.positionService.get({}, {cache: false}).then(function (result: IPosition[]) {
            vm.positions = result;
        });

        vm.positionCategoryService.getPositionCategory().then(function (result: IPositionCategory[]) {
            vm.positionCategories = result;
        });

        vm.locationService.getLocationTree({cache: false}).then(function (result: ILocation[]) {
            vm.locations = result;
            //vm.setParent(vm.locations, null);
        });

        // educationLevel
        vm.educationLevelService.get().then(function (result: IEducationLevel[]) {
            vm.educationLevel = result;
        });


        // get company
        vm.companyService.get({}, {cache: false}).then(function (result: ICompany[]) {
            vm.companies = result;
        });

        // jobNatures
        vm.positionService.getjobNatures({}, {cache: false}).then(function(result: IJobNature[]) {
            vm.jobNatures = result;
        });


    }



    initFilter() {
        var vm = this;

        if(!_.isUndefined(vm.$stateParams['search']) && vm.$location.path() === '/article-search') {
            vm.article_query = vm.$stateParams['search'];
            vm.searchIndex = 2;
        }

        _.each(['search', 'salaryType', 'educationLevelIds', 'categoryIds', 'type', 'locationIds'], function (val: string) {
            if (!_.isUndefined(vm.$stateParams[val])) {
                vm.filter[val] = vm.$stateParams[val];
                if(vm.$location.path() === '/article-search') { vm.filter.search = ''; }
                if (!_.isUndefined(vm.$stateParams['categoryIds'])) vm.defaultPositionCategoryIds = vm.$stateParams['categoryIds'];
                if (!_.isUndefined(vm.$stateParams['locationIds'])) vm.defaultLocationIds = vm.$stateParams['locationIds'];
                if (!_.isUndefined(vm.$stateParams['educationLevelIds'])) vm.defaultEducationLevelIds = vm.$stateParams['educationLevelIds'];
            }

            if (!_.isArray(vm.$stateParams['categoryIds']) && !_.isUndefined(vm.$stateParams['categoryIds'])) {
                vm.defaultPositionCategoryIds = [vm.$stateParams['categoryIds']];
            }
            if (!_.isArray(vm.$stateParams['locationIds']) && !_.isUndefined(vm.$stateParams['locationIds'])) {
                vm.defaultLocationIds = [vm.$stateParams['locationIds']];
            }

            if (!_.isArray(vm.$stateParams['educationLevelIds']) && !_.isUndefined(vm.$stateParams['educationLevelIds'])) {
                vm.defaultEducationLevelIds = [vm.$stateParams['educationLevelIds']];
            }

        });
        _.each(['companyId', 'minSalary', 'maxSalary', 'experience'], function (val: string) {
            if (!_.isUndefined(vm.$stateParams[val])) vm.filter[val] = parseInt(vm.$stateParams[val]);
        });


        if (_.isUndefined(vm.filter.experience)) vm.filter.experience = 0;
        if (_.isUndefined(vm.filter.salaryType)) vm.filter.salaryType = 'monthly';
        if (_.isUndefined(vm.filter.minSalary)) vm.filter.minSalary = 0;
        if (_.isUndefined(vm.filter.maxSalary)) vm.filter.maxSalary = vm.filter.salaryType === 'monthly' ? 100000 : 500;


        if(!_.isUndefined(vm.$stateParams['jobNatureId'])) {
            vm.selectJobNature(vm.$stateParams['jobNatureId']);
            vm.filter.jobNatureId = parseInt(vm.$stateParams['jobNatureId']);
        }



    }

    selectJobNature(id: string) {
        var vm = this;
        vm.positionService.findJobNature(id, {}, {cache: false}).then(function(result: IJobNature) {
            vm.selectedJobNature = result;
        });
    }


    initFilterSearch() {
        var vm = this;
        if (_.isUndefined(vm.filter.experience)) {
            vm.filter.experience = 0;
            vm.$location.search('experience', null);
        }
        if (_.isUndefined(vm.filter.salaryType)) {
            vm.filter.salaryType = 'monthly';
            vm.$location.search('salaryType', null);
        }
        if (_.isUndefined(vm.filter.minSalary)) {
            vm.filter.minSalary = 0;
            vm.$location.search('minSalary', null);
        }
        if (_.isUndefined(vm.filter.maxSalary)) {
            vm.filter.maxSalary = vm.filter.salaryType === 'monthly' ? 100000 : 500;
            vm.$location.search('maxSalary', null);
        }
    }

    switchSalaryType(type: string) {
        var vm = this;
        vm.filter.salaryType = type;
        vm.initSalaryRange(type);
    }

    initSalaryRange(type: string) {
        var vm = this;
        vm.filter.minSalary = 0;
        vm.filter.maxSalary = type === 'monthly' ? 100000 : 500;
    }


    // home search position
    searchPosition() {
        var vm = this;
        vm.filter.categoryIds = _.map(vm.selectedPositionCategories, 'id');
        vm.filter.locationIds = _.map(vm.selectedLocations, 'id');
        vm.filter.educationLevelIds = _.map(vm.selectedEducationLevel, 'id');
        if(!_.isUndefined(vm.selectedJobNature)) vm.filter.jobNatureId = vm.selectedJobNature.id;
        if (_.isEqual(vm.filter, vm.filterOld)) {
            vm.showInvalidMessage = true;
        } else {
            if (vm.filter.minSalary === 0 && (vm.filter.maxSalary === 500 || vm.filter.maxSalary === 100000)) {
                delete vm.filter.salaryType;
                delete vm.filter.maxSalary;
            }
            if (vm.filter.minSalary === 0) delete vm.filter.minSalary;
            if (vm.filter.experience === 0) delete vm.filter.experience;
            vm.$state.go('main.positions', vm.filter);
            vm.initFilterSearch();
            vm.showInvalidMessage = false;
        }
    }


    // search position refresh
    getPositionLocation(val: string) {
        var vm = this;
        return vm.positionService.get({
            search: val
        }).then(function (result: IPosition[]) {
            return result;
        });
    };

//  search article refresh
    getArticle(val: string) {
        var vm = this;
        return vm.articleService.get({'search': val}, {cache: false}).then(function (result: any) {
            return result;
        });
    }

    searchArticle() {
        var vm = this;
        vm.$state.go('main.article-search', {'search': vm.article_query});
    }


    searchToggle(category: string) {
        var vm = this;
        for (var key in vm.searchShow) {
            if (category === key) {
                vm.searchShow[key] = !vm.searchShow[key];
            } else {
                vm.searchShow[key] = false;
            }
            if (category === 'toggleHide') {
                vm.searchShow[key] = false;
            }
        }
    }


}
