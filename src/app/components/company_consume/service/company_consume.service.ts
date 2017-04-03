export class CompanyConsumeService {
    /* @ngInject */
    constructor(private Restangular: any,
                private PublicRestangular: any) {
        //
    }

// get company position
    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('enterprise/bills').withHttpConfig(httpConfig).getList(param);
    }

}
