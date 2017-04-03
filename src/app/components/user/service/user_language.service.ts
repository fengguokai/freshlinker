export interface ILanguage {
  languageId?: string;
  id?: string;
  level: string;
}

export class UserLanguageService {
  /* @ngInject */
  constructor(private Restangular: any) {
    //
  }

  init(): any {
    return this.Restangular.one('user/users/self/languages', '');
  }

  get(param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').all('languages').withHttpConfig(httpConfig).getList(param);
  }

  find(languageId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').one('languages', languageId).withHttpConfig(httpConfig).get(param);
  }

  update(languageId: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('languages', languageId).customPUT(data);
  }

  store(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').all('languages').post(data);
  }

  destroy(id: string): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('languages', id).remove();
  }


}
