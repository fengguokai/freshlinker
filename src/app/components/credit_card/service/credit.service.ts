export interface ICredit {
    id?: string;
    name?: string;
    last4?: string;
    exp_month?: string;
    exp_year?: string;
    brand?: string;
    country?: string;
    default_source?: boolean;
}

export class CreditService {
    /* @ngInject */
    constructor(private Restangular: any,
                private PublicRestangular: any) {
        //
    }

// get company position
    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('enterprise/cards').withHttpConfig(httpConfig).getList(param);
    }


    store(data: Object): ng.IPromise<any> {
        return this.Restangular.all('enterprise/cards').post(data);
    }


    find(companyId: string, positionInvitationJobId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('position_invitation_jobs', positionInvitationJobId).withHttpConfig(httpConfig).get(param);
    }


    recharger(data: Object): ng.IPromise<any> {
        return this.Restangular.all('enterprise/deposit').post(data);
    }

    setDefaultCredit(cardId: string, data?: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/cards').one(cardId, 'default').post(data);
    }


    destroy(cardId: string): ng.IPromise<any> {
        return this.Restangular.one('enterprise/cards', cardId).remove();
    }

    buyPlan(data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/plans').customPOST(data);
    }





}
