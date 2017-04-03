export interface IPositionCategory {
  id?: string;
  name?: string;
  description?: string;
  children?:IPositionCategory[];
}

export class PositionCategoryService {

  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any,
              private $q: ng.IQService,
              private PublicRestangular: any) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.PublicRestangular.all('position_categories').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.PublicRestangular.one('position_categories', id).withHttpConfig(httpConfig).get(param);
  }

  // get position category
  getPositionCategory(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.PublicRestangular.all('position_categories/tree').withHttpConfig(httpConfig).getList(param);
  }

  // add category to position

  addPositionCategory(data: Object): ng.IPromise<any> {
    return this.Restangular.one('admin', 'position_categories').customPOST(data);
  }


}

