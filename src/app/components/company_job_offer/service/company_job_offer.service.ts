export interface IJobOffer {
    id?: string;
    positionId: string;
    companyId: string;
    filter: any;
    active: boolean;
    total? :number;
    name?: string;
    position?: any;
}


export class JobOfferService {
    /* @ngInject */
    constructor(private Restangular: any,
                private PublicRestangular: any) {
        //
    }

// get company position
    get(companyId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).all('position_invitation_jobs').withHttpConfig(httpConfig).getList(param);
    }

    // get invite num

    getInviteNum(companyId: string, positionInvitationJobId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('position_invitation_jobs', positionInvitationJobId).one('persons').withHttpConfig(httpConfig).get(param);
    }

    find(companyId: string, positionInvitationJobId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('position_invitation_jobs', positionInvitationJobId).withHttpConfig(httpConfig).get(param);
    }


    store(companyId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).all('position_invitation_jobs').post(data);
    }

    update(companyId: string, positionInvitationJobId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('position_invitation_jobs', positionInvitationJobId).customPUT(data);
    }

    destroy(companyId: string, positionInvitationJobId: string): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('position_invitation_jobs', positionInvitationJobId).remove();
    }


    checkPrice(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('enterprise/position_invitation_jobs').withHttpConfig(httpConfig).post(param);
    }

}
