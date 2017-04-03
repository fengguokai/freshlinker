export class DashboardService {

  /* @ngInject */
  constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
    //
  }

  findCompanyByUser( param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.all('enterprise/companies').withHttpConfig(httpConfig).getList(param);
  }


  findCompany (companyId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).withHttpConfig(httpConfig).get(param);
  }

  findCompanyPositions(companyId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).all('positions').withHttpConfig(httpConfig).getList(param);
  }

  // educationChart,experienceChart
  getChart(companyId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('chart').withHttpConfig(httpConfig).get(param);
  }

  getCompany (param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/enterprises', 'self').one('companies_info', '').withHttpConfig(httpConfig).get(param);
  }




}
