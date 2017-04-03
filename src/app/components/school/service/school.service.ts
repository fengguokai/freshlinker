export interface ISchool {
    id?: string;
    name?: string;
}


export class SchoolService {
    /* @ngInject */
    constructor(private Restangular: any,
                private PublicRestangular: any) {
        //
    }


    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('schools').withHttpConfig(httpConfig).getList(param);
    }

    find( id ,param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.one('schools', id).withHttpConfig(httpConfig).get(param);
    }



}
