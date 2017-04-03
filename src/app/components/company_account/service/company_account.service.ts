export interface IAccount {
    limit?: number;
    page?: number;
    startedDate?: Date;
    endedDate?: Date;
}

export class CompanyAccountService {
    /* @ngInject */
    constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
        //
    }

    getAccount(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('enterprise/invoices').withHttpConfig(httpConfig).getList(param);
    }

}
