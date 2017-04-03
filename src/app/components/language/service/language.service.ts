export interface ILanguage {
  languageId?: string;
  name?: string;
}


export class LanguageService {
  /* @ngInject */
  constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/languages').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('public/languages', id).withHttpConfig(httpConfig).get(param);
  }

  store(data: Object): ng.IPromise<any> {
    return this.Restangular.all('public/languages').post(data);
  }


}
