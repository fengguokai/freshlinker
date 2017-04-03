export interface ICarsoul {
  id: number;
  image: string;
}

export class HomeService {

  static $inject = ['Restangular'];

  constructor(private Restangular: restangular.IService) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('countries').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('countries', id).withHttpConfig(httpConfig).get(param);
  }

  getInvitation(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
  return this.Restangular.one('public', 'positionInvitation').all('positions').withHttpConfig(httpConfig).getList(param);
}
  
}
