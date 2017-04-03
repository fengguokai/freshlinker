export class CompanyRechargeService {
    /* @ngInject */
    constructor(private Restangular: any,
                private PublicRestangular: any) {
        //
    }

    recharger(data: Object): ng.IPromise<any> {
        return this.Restangular.all('enterprise/deposit').post(data);
    }
}
