export interface ICompany {
  id?: string;
  countryId?: number;
  userId?: number;
  name?: string;
  url?: string;
  scale?: string;
  field?: string;
  stage?: string;
  background?: string;
  isApproved?: boolean;
  address?: string;
  description?: string;
  icon?: any;
  foundingTime?: number;
  pictures?: any;
  cover?: any;
  positions?: any;
}

export interface  IPicture {
  id?: number;
  thumbUrl?: string;
  url?: string;
}

export interface IStage {
  id?: string;
  name?: string;
}

export interface IScale {
  id?: string;
  name?: string;
}

export interface IExperience {
  data?: number;
  name?: string;
}


export class CompanyService {

  public scales: IScale[] = [];
  public experiences: IExperience[] = [];
  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any,
              private $q: ng.IQService,
              private $translate: angular.translate.ITranslateService) {
    var vm = this;
  }


  // with user login
  init(): any {
    return this.Restangular.one('enterprise/companies', '');
  }

  // get company without login
  get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.all('public/companies').withHttpConfig(httpConfig).getList(param);
  }

    getCompany(companyId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).withHttpConfig(httpConfig).get(param);
    }

  // get user's company data
  findCompanyByUser(param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', 'self').withHttpConfig(httpConfig).get(param);
  }

  getEnterprise(param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/enterprises', 'self').withHttpConfig(httpConfig).get(param);
  }


  // store user's company data
  store(data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies').customPOST(data);
  }

// update user's company data
  update(companyId: string , data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).customPUT(data);
  }


  // without login get company data
  find(id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('public/companies', id).withHttpConfig(httpConfig).get(param);
  }

  // Company update upload picture
  updatePicture(companyId: string, isIcon: boolean, files, data: Object): ng.IPromise<any> {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('file', files[i]);
    }
    return this.Restangular.one('enterprise/enterprises', 'self').one('companies', companyId).one('picture', isIcon)
      .withHttpConfig({transformRrequest: angular.identity})
      .customPUT(fd, '', undefined, {'Content-Type': undefined});
  }



  // Company upload picture
  uploadPicture(companyId:string, files, data: Object): ng.IPromise<any> {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('file', files[i]);
    }
    return this.Restangular.one('enterprise/companies',companyId).one('icon', '')
      .withHttpConfig({transformRrequest: angular.identity})
      .customPOST(fd, '', undefined, {'Content-Type': undefined});
  }


  // cover
  uploadCompanyCover(companyId: string, files, data: Object): ng.IPromise<any> {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('file', files[i]);
    }
    return this.Restangular.one('enterprise/companies',companyId).one('cover', '')
        .withHttpConfig({transformRrequest: angular.identity})
        .customPOST(fd, '', undefined, {'Content-Type': undefined});
  }


  // picture
  uploadCompanyPicture(companyId: string, files, data: Object): ng.IPromise<any> {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('file', files[i]);
    }
    return this.Restangular.one('enterprise/companies',companyId).one('pictures', '')
        .withHttpConfig({transformRrequest: angular.identity})
        .customPOST(fd, '', undefined, {'Content-Type': undefined});
  }

  getCompanyPictures(companyId, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
  return this.Restangular.one('enterprise/companies', companyId).all('pictures').withHttpConfig(httpConfig).getList(param);
}

  getCompanyScale () {
    var vm = this;
    vm.scales = [
      {
        id: '1',
        name: '一人公司',
        value: 'myself-only'
      },
      {
        id: '2',
        name: '2-10',
        value: '2-10'
      },
      {
        id: '3',
        name: '11-50',
        value: '11-50'
      },
      {
        id: '4',
        name: '51-200',
        value: '51-200'
      },
      {
        id: '5',
        name: '201-500',
        value: '201-500'
      },
      {
        id: '6',
        name: '501-1000',
        value: '501-1000'
      },
      {
        id: '7',
        name: '1001-5000',
        value: '1001-5000'
      },
      {
        id: '8',
        name: '5001-10000',
        value: '5001-10000'
      },
      {
        id: '9',
        name: '10001+',
        value: '10001+'
      }
    ];
    return vm.scales;
  }

  getExperience() {
    var vm = this;
    for (var i = 0; i <= 6; i++) {
      if (i !== 1 && i !== 0) {
        vm.experiences.push({
          data: i - 1,
          name: (i - 1) + vm.$translate.instant('message.position_experience_year')
        });
      } else if (i === 1) {
        vm.experiences.push({data: 0.5, name: vm.$translate.instant('message.position_experience_half')});
      } else if (i === 0) {
        vm.experiences.push({data: i, name: vm.$translate.instant('message.position_experience_no')});
      }
    }

    return vm.experiences;
  }


}
