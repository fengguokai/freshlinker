export interface IUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  selfDescription?: string;
  phone?: string;
  gender?: string;
  yearOfExperience?: string;
  birth?: Date;
  nationalityId?: number;
  expectJobs?: any;
  educations?: any;
  experiences?: any;
  languages?: any;
  skills?: any;
  icon?: any;
}

export interface IUpload {
  file:any;
}


export interface ISkill {
  id?: string;
  name?:  string;
}

export class UserService {
  /* @ngInject */
  constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
    //
  }

  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('user/users').withHttpConfig(httpConfig).getList(param);
  }

  find( param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').withHttpConfig(httpConfig).get(param);
  }


  checkUser( param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user', 'is_activated').withHttpConfig(httpConfig).post();
  }

  checkEnterprise( param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise', 'is_activated').withHttpConfig(httpConfig).post();
  }

  storeUser(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/activate').customPOST(data);
  }

  storeEnterprise(data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/activate').customPOST(data);
  }


  findUser(userId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('public/users', userId).withHttpConfig(httpConfig).get(param);
  }


  update(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').customPUT(data);
  }

  init(): any {
    return this.Restangular.one('user/users', '');
  }

  store(data: Object): ng.IPromise<any> {
    return this.Restangular.one('user/users', 'self').customPUT(data);
  }

  // User upload picture
  uploadPicture(files, data: Object): ng.IPromise<any> {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('file', files[i]);
    }
    return this.Restangular.all('user/users/self/icon')
      .withHttpConfig({transformRrequest: angular.identity})
      .customPOST(fd, '', undefined, {'Content-Type': undefined});
  }

  getPositionInvitations(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all( 'user/position_invitations').withHttpConfig(httpConfig).getList(param);
  }

  getSkill(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/tags').withHttpConfig(httpConfig).getList(param);
  }

  getComparedSkill(positionId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user/skills/positions', positionId).one('skill_compared').withHttpConfig(httpConfig).get(param);
  }

  getCandidates(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('user/candidates').withHttpConfig(httpConfig).getList(param);
  }

}
