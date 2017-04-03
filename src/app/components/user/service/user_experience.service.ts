export interface IExperience {
  id?: string;
  companyName?:  string;
  title?: string;
  endedDate?: Date;
  description?: string;
  startedDate?: Date;
}

export class UserExperienceService {
  /* @ngInject */
  constructor(private Restangular: restangular.IService, private $q: ng.IQService) {
    //
  }

  init(): any {
    return this.Restangular.one('user/users/experiences', '');
  }

  get( param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').all('experiences').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').one('experiences', id).withHttpConfig(httpConfig).get(param);
  }

  update(id: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('experiences', id).customPUT(data);
  }

  store(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').all('experiences').post(data);
  }

  destroy( id: string): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('experiences', id).remove();
  }


}
