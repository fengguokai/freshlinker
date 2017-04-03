export interface IRole {
    id?: string;
    name?: string;
    description?: string;
}
export interface IPost {
    email: string;
    firstName: string;
    lastName: string;
}

export class RoleService {
    /* @ngInject */
    constructor(private Restangular: any) {
        //
    }


    //get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
    //    return this.Restangular.one('user/users', 'self').withHttpConfig(httpConfig).getList(param);
    //}

    find( param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('user/users', 'self').withHttpConfig(httpConfig).get(param);
    }


    store(data: Object): ng.IPromise<any> {
        return this.Restangular.one('user/users', 'self').all('role').post(data);
    }

    storeCompanyType(data: Object): ng.IPromise<any> {
        return this.Restangular.all('enterprise/plans').customPOST(data);
    }

    getPlan(planId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/plans', planId).withHttpConfig(httpConfig).get(param);
    }


    setPlan(data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise', 'plans').customPOST(data);
    }


}
