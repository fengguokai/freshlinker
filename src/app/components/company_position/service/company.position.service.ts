export interface IPosition {
  id?: string;
  active?: boolean;
  name?: string;
  type?: string;
  minSalary?: number;
  maxSalary?: number;
  educationLevelId?: number;
  locationId?: number;
  temptation?: string;
  experience?: string;
  address?: string;
  categoryIds?: Array<number>;
  categories?: Array[];
  jobReferenceNumber?: number;
  salaryType: string;
  companyId?: string;
  description?: string;
  skills?: any;
  tags?: any;
  jobNatureId?: number;
  locations?: any;
  companyId?: number;
}

export interface IPositionCategory {
  id?: string;
  parentId?: number;
  depth?: number;
  name?: string;
  description?: string;
  categories?: any;
}

export interface IExperience {
  id?: number;
  value?: string;
  name?: string;

}

export class CompanyPositionService {

  public experience: IExperience[] = [];
  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any, private $q: ng.IQService,
              private $translate: angular.translate.ITranslateService
  ) {
    //
  }

  init(): any {
    return this.Restangular.one('enterprise/companies').one('self/positions', '');
  }

  getExperience() {
    var vm = this;
    vm.experience = [
      {
        id: 1,
        value: "0",
        name: vm.$translate.instant('message.position_experience_no')
      },
      {
        id: 2,
        value: "0.5",
        name: vm.$translate.instant('message.position_experience_half')
      },
      {
        id: 3,
        value: "1",
        name: 1 + vm.$translate.instant('message.position_experience_year')
      },
      {
        id: 4,
        value: "2",
        name: 2 + vm.$translate.instant('message.position_experience_year')
      },
      {
        id: 5,
        value: "3",
        name: 3 + vm.$translate.instant('message.position_experience_year')
      },
      {
        id: 6,
        value: "4",
        name: 4 + vm.$translate.instant('message.position_experience_year')
      },
      {
        id: 7,
        value: "5+",
        name: vm.$translate.instant('message.position_experience_5')
      }
    ];
    return vm.experience;
  }

  getPositionCategory(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/position_categories').withHttpConfig(httpConfig).getList(param);
  }

  // without enterprise login
  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/positions').withHttpConfig(httpConfig).getList(param);
  }

  getPositionByCompany(companyId: string , param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).all('positions').withHttpConfig(httpConfig).getList(param);
  }

  getCompanyPosition(companyId: string , param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('public/companies', companyId).all('positions').withHttpConfig(httpConfig).getList(param);
  }

  find(companyId: string, positionId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).withHttpConfig(httpConfig).get(param);
  }

  update(companyId: string, positionId: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).customPUT(data);
  }

  backOnlinePosition(companyId: string, positionId: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).all('renew').customPUT(data);
  }

  store(companyId: string,data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies',companyId).all('positions').customPOST(data);
  }



  destroy(companyId: string , positionId: string): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).remove();
  }

  // educationChart,experienceChart
  getChart(positionId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/positions', positionId).one('chart').withHttpConfig(httpConfig).get(param);
  }



}
