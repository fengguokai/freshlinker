export interface IEducation {
  id: string;
  educationLevelId: number;
  schoolId: string;
  subject: string;
  graduationYear: number;
  remark?: string;
  gpa?: string;

}




export class UserEducationService {

  public years: number[] = [];
  public myYear: number;

  /* @ngInject */
  constructor(private Restangular: restangular.IService, private $q: ng.IQService) {
    //
  }

  init(): any {
    return this.Restangular.one('user/users/self/educations', '');
  }

  get(param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').all('educations').withHttpConfig(httpConfig).getList(param);
  }

  find(id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    param = param || {};
    httpConfig = httpConfig || {};
    return this.Restangular.one('user/users', 'self').one('educations', id).withHttpConfig(httpConfig).get(param);
  }

  update( id: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('educations', id).customPUT(data);
  }

  store( data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').all('educations').post(data);
  }

  destroy(id: string): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').one('educations', id).remove();
  }

  getYears() {
    var vm = this;
    // create date
    var myDate = new Date();
    vm.myYear = myDate.getFullYear();
    for (var i = 1970; i <= vm.myYear; i++) {
      vm.years.push(i);
    }
    return vm.years;
  }


}
