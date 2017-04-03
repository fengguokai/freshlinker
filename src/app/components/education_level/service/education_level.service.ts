export interface IEducationLevel {
  id?: string;
  name?: string;
  description?: string;
}

export class EducationLevelService {

  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any,
              private $q: ng.IQService) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/education_levels').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('public/education_levels', id).withHttpConfig(httpConfig).get(param);
  }


}
