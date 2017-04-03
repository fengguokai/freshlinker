export interface ICountry {
  id: number;
  parentId?: number;
  depth?: number;
  code?: string;
  name?: string;
}

export class CountryService {

  /* @ngInject */
  constructor(private PublicRestangular: restangular.IService) {

  }

  init(): any {
    return this.PublicRestangular.one('countries', '');
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.PublicRestangular.all('countries').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.PublicRestangular.one('countries', id).withHttpConfig(httpConfig).get(param);
  }

  update(id: string, data: Object): ng.IPromise<any> {
    return this.PublicRestangular.one('countries', id).customPUT(data);
  }

  store(data: Object): ng.IPromise<any> {
    return this.PublicRestangular.all('countries').post(data);
  }

  destroy(id: string): ng.IPromise<any> {
    return this.PublicRestangular.one('countries', id).remove();
  }

}
