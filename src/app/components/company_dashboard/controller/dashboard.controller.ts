import {ICompany, IPicture, CompanyService} from '../../company/service/company.service';
import {IErrorMessage, MessageService} from '../../../shared/global/service/global.service';
import {MetaService} from '../../../main/meta.service';
import {SelectCompanyController} from '../../company_dashboard/controller/select.company.controller';
import {DashboardService} from '../../company_dashboard/service/dashboard.service';
import {AuthService} from '../../auth/service/auth.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {IPosition} from '../../position/service/position.service';
import {RoleService} from '../../role/service/role.service';
import {CompanyEditImageController} from '../controller/company_edit_image.controller';
import {EnterpriseService, IEnterprise} from '../../enterprise/service/enterprise.service';

export interface IChart {
    description?: string;
    value?: string;
    name?: string;
}

export class DashboardController {
    public tableLoading: boolean = false;
    public positions: IPosition[] = [];
    public itemsByPage: number = 3;
    public companyId: string;
    public currentDate: Date;


    public enterprise: IEnterprise = {};
    public dashboardLoading: boolean = false;



    public filter: {
        limit: number;
        page: number;
        candidateStatusId: number;
    } = {
        limit: this.itemsByPage,
        page: parseInt(this.$location.search().page) || 1,
        candidateStatusId: 1
    };

    public  candidateNum: number = 0;

    //educationChart
    public educationChartLabels: IChart[] = [];
    public educationChartData: IChart[] = [];

    //experienceChart
    public experienceChartLabels: IChart[] = [];
    public experienceChartData: IChart[] = [];

    // skillChart
    public skillChartLabels: IChart[] = [];
    public skillChartData: IChart[] = [];

    // schoolChart
    public schoolChartLabels: IChart[] = [];
    public schoolChartData: IChart[] = [];

    // subjectChart
    public subjectChartLabels: IChart[] = [];
    public subjectChartData: IChart[] = [];

    public chartLoading: boolean = false;
    public chartIndex: number;
    public chartTabs: any = [];

    public plan: any;
    public total: number;

    public pictures: any = [];
    public loadPictures: IPicture[] = [];
    public pictureLoading: boolean = false;
    public pictureSlick: any;

    public isSkill: boolean = false;
    public isSubject: boolean = false;
    public isSchool: boolean = false;

    public descriptionShow: boolean = false;

    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private $uibModal: angular.ui.bootstrap.IModalService,
                private $log: ng.ILogService,
                private $state: any,
                private dashboardTabsService: DashboardTabsService,
                private dashboardService: DashboardService,
                private localStorageService: any,
                private $location: ng.ILocationService,
                private $timeout: any,
                private roleService: RoleService,
                private companyService: CompanyService,
                private company: any,
                private enterpriseService: EnterpriseService,
                private Lightbox: any) {

        var vm = this;

        vm.dashboardTabsService.set('dashboard');
        vm.companyId = company.id;

        vm.localStorageService.set('company', company.id);

        // set page config
        MetaService.pageTitle = vm.$translate.instant('user.profile.user_enterprise');

        vm.currentDate = new Date();
        vm.currentDate = moment(vm.currentDate).format('YYYY-MM-DD');
        vm.pictureSlick = {
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true,
                        dots: false,
                        arrows: true
                    }
                },
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false,
                        arrows: true
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };

        // get company pictures
        vm.pictureLoading = true;
        vm.companyService.getCompanyPictures(company.id, {}, {cache:false}).then(function(result: any) {
            vm.pictures = result;
            _.each(vm.pictures, function(value: any) {
                var index = _.findIndex(vm.loadPictures, {id: value.id});
                if(index === -1) vm.loadPictures.push({'id': value.id, 'thumbUrl': value.url['600'],'url': value.url['1024']});
            });
            vm.pictureLoading = false;
        });

        vm.chartTabs = [
            {
                id: 1,
                name: 'user.profile.experience'
            },
            {
                id: 2,
                name: 'user.profile.education'
            },
            {
                id: 3,
                name: 'user.profile.skill'
            },
            {
                id: 4,
                name: 'user.profile.school'
            },
            {
                id: 5,
                name: 'user.profile.subject'
            }
        ];

        vm.changeTab(1);

        vm.companyService.getEnterprise({}, {cache: false}).then(function(result: any) {
            vm.total = result.balance;
        });

        // get enterprise
        vm.dashboardLoading = true;
        vm.enterpriseService.find({}, {cache: false}).then(function(result: IEnterprise) {
            vm.enterprise = result;
            vm.dashboardLoading = false;
        });


    }

    changeTab(tabId: number) {
        var vm = this;
        vm.chartIndex = tabId;
        vm.chartLoading = true;
        vm.dashboardService.getChart(vm.companyId, {}, {cache: false}).then(function (result: any) {
            vm.candidateNum = result.totalCandidates;
            vm.educationChartLabels = [];
            vm.educationChartData = [];

            vm.experienceChartData = [];
            vm.experienceChartLabels = [];

            vm.skillChartLabels = [];
            vm.skillChartData = [];

            vm.schoolChartData = [];
            vm.schoolChartLabels = [];

            vm.subjectChartData = [];
            vm.subjectChartLabels = [];
            if (vm.chartIndex === 2) {
                _.each(result.educationLevels, function (value: any) {
                    vm.educationChartLabels.push(value.name);
                    vm.educationChartData.push(value.value);

                });
            } else if(vm.chartIndex === 1) {
                _.each(result.yearOfExperience, function (value: any) {
                    vm.experienceChartData.push(value.value);
                    vm.experienceChartLabels.push(value.name);
                });
            } else if (vm.chartIndex === 3) {
                if(result.skills.length > 0) {
                    _.each(result.skills, function(value: any, key: number) {
                        if(key <= 7) {
                            vm.skillChartData.push(value.sum);
                            vm.skillChartLabels.push(value.name);
                        }

                    });
                    vm.isSkill = true;
                } else {
                    vm.isSkill = false;
                }

            } else if(vm.chartIndex === 4) {
                if(result.school.length > 0) {
                    _.each(result.school, function(value: any, key: any) {
                        if(key <= 7) {
                            vm.schoolChartData.push(value.sum);
                            vm.schoolChartLabels.push(value.name);
                        }
                    });
                    vm.isSchool = true;
                } else {
                    vm.isSchool = false;
                }

            } else if(vm.chartIndex === 5) {
                if(result.subject.length > 0) {
                    _.each(result.subject, function(value: any, key: number) {
                        if(key <= 7) {
                            vm.subjectChartData.push(value.sum);
                            vm.subjectChartLabels.push(value.name);
                        }

                    });
                    vm.isSubject = true;
                } else {
                    vm.isSubject = false;
                }

            }
            vm.chartLoading = false;
        });


    }

    callServer(tableState: any) {
        var vm = this['$parent']['dashboardCtrl'];
        var params = angular.copy(vm.filter);
        var pagination = tableState['pagination'];

        vm.tableLoading = true;

        if (vm.paginationAction === 'prev') {
            params.page = pagination.prev;
        } else if (vm.paginationAction === 'next') {
            params.page = pagination.next;
        }

        var keys = ['limit', 'page', 'search'];
        _.each(keys, function (value: string, index: number) {
            if (_.isUndefined(params[value]) || params[value] === null || params[value] === '') {
                delete params[value];
            }
        });


        vm.dashboardService.findCompanyPositions(vm.companyId, params, {cache: false}).then(function (result: any) {
            if (result.length !== 0) {
                vm.positions = result;
                _.each(vm.positions, function (value: any) {
                    value.expiredDate = moment(value.expiredDate).format('YYYY-MM-DD');
                });
            }

            if (result.length === 0) {
                tableState['pagination']['next'] = null;
                tableState['pagination']['prev'] = null;
            } else {
                tableState['pagination']['next'] = result['meta']['pagination']['nextPage'] || null;
                tableState['pagination']['prev'] = result['meta']['pagination']['prevPage'] || null;
                vm.$location.search('page', result['meta']['pagination']['currentPage']);
            }

            vm.$timeout(function () {
                vm.tableLoading = false;
            }, 0);

        });


    }

    openEditCompanyImage(id: string) {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            animation: true,
            templateUrl: 'app/components/company_dashboard/template/company.edit.image.html',
            controller: CompanyEditImageController,
            controllerAs: 'formCtrl'
        });
        modalInstance.result.then(function (result: any) {
            if(!_.isUndefined(result)) vm.company.icon = result;
        }, function () {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });
    }

    openLightboxModal(index : number) {
        var vm = this;
        vm.Lightbox.openModal(vm.loadPictures, index);
    }



}
