export interface ICandidate {
  id?: string;
  companyId?: number;
  candidateStatusId?: number;
  positionId?: number;
  enterpriseId?: number;
  positionName?: string;
  positionPostedDate?: Date;
  isBlacklist?: boolean;
  isRead?: boolean;
}


export class CandidatePositionService {


  /* @ngInject */
  constructor(private Restangular: any,
              private localStorageService: any,
              private $q: ng.IQService) {
    //
  }

  // Candidate routes
  get(companyId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).all('candidates').withHttpConfig(httpConfig).getList(param);
  }

  find(companyId: string , id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('candidates', id).withHttpConfig(httpConfig).get(param);
  }


  update(companyId: string, id: string, data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('candidates', id).customPUT(data);
  }

  store(companyId: string , data: Object): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).all('candidates').post(data);
  }

  destroy(companyId: string, id: string): ng.IPromise<any> {
    return this.Restangular.one('enterprise/companies', companyId).one('candidates', id).remove();
  }


}
