export interface ICandidate {
  id?: string;
  companyId?: number;
  candidateStatusId?: number;
  positionId?: number;
  userId?: number;
  positionName?: string;
  positionPostedDate?: Date;
  isBlacklist?: boolean;
  isRead?: boolean;
  candidateId?: string;
  answer?: Array[];
}

export class CandidateService {

  /* @ngInject */
  constructor(private Restangular: any) {
    //
  }

  // find user's candidates
  check(id: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('user/positions', id).one('check').withHttpConfig(httpConfig).get(param);
  }

  applyPosition(positionId: string, data?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user/positions', positionId).all('apply').post(data);
  }

  userApplyPosition(positionInvitationId: string, data?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user/position_invitations', positionInvitationId).all('apply').post(data);
  }


  rejectPositionInvite(positionInvitationId: string, data?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    return this.Restangular.one('user/position_invitations', positionInvitationId).all('reject').post(data);
  }



}
