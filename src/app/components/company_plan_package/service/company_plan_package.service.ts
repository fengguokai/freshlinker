export interface IPlan {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    balance?: number;
    positionQuota?: number;
    planExpiredDate?: Date;
}

export class CompanyPlanPackageService {
    /* @ngInject */
    constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
        //
    }

    setPlan(data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise', 'plans').customPOST(data);
    }

    getPlan(planId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/plans', planId).withHttpConfig(httpConfig).get(param);
    }


    getPublicPlan(planId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('public/plans', planId).withHttpConfig(httpConfig).get(param);
    }


}
