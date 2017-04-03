export interface ICategory {
  cid?: string;
  name?: string;
}


export class CategoryService {
  /* @ngInject */
  constructor(private CommunityRestangular: restangular.IService) {
//
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.CommunityRestangular.all('categories').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.CommunityRestangular.one('categories', id).withHttpConfig(httpConfig).get(param);
  }


}
