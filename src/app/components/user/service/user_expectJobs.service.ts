export interface IExpect {
  id?: string;
  userId?: string;
  expectPositionId?: string;
  content?: string;
  type?: string;
  salaryType?: string;
  minSalary?: number;
  maxSalary?: number;
  locationId?: string;
  expectPosition?: any;
  jobNatureId?: string;
}


export class UserExpectService {
  /* @ngInject */
  constructor(private Restangular: restangular.IService, private $q: ng.IQService) {
    //
  }

  init(): any {
    return this.Restangular.one('user/users/self/ecpect_jobs', '');
  }

  get(param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').all('expect_jobs').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').one('expect_jobs', id).withHttpConfig(httpConfig).get(param);
  }

  update(id: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('expect_jobs', id).customPUT(data);
  }

  store(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').all('expect_jobs').post(data);
  }

  destroy(id: string): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('expect_jobs', id).remove();
  }


}
