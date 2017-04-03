export interface ILocation {
    id?: string;
    name?: string;
}

export class LocationService {

    /* @ngInject */
    constructor(private PublicRestangular: restangular.IService) {
        //
    }

    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('locations').withHttpConfig(httpConfig).getList(param);
    }

    find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.one('locations', id).withHttpConfig(httpConfig).get(param);
    }

    getLocationTree(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('locations/tree').withHttpConfig(httpConfig).getList(param);
    }

}
