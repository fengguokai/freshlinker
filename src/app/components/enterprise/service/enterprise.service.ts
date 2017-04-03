export interface IEnterprise {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
  positionQuota?: number;
  planExpiredDate?: Date;
  balance?: string;
}

export class EnterpriseService {
  /* @ngInject */
  constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('enterprise/enterprises').withHttpConfig(httpConfig).getList(param);
  }

  find( param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/enterprises', 'self').withHttpConfig(httpConfig).get(param);
  }

  update(data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/enterprises', 'self').customPUT(data);
  }

  init(): any {
    return this.Restangular.one('enterprise/enterprises', '');
  }

  activate(data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/activate').customPOST(data);
  }

  setPlan(data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise', 'plans').customPOST(data);
  }

  getPlan(planId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/plans', planId).withHttpConfig(httpConfig).get(param);
  }

  getAccount(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('enterprise/invoices').withHttpConfig(httpConfig).getList(param);
  }

  getPublicPlan(planId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('public/plans', planId).withHttpConfig(httpConfig).get(param);
  }


}
