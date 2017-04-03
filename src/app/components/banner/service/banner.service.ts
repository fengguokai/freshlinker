export interface IBanner {
    id?: string;
    url?: string;
    name?: string;
    order?: number;
    imageUrl?: string;
}


export class BannerService {

    /* @ngInject */
    constructor(private Restangular: any,
                private localStorageService: any,
                private $q: ng.IQService,
                private PublicRestangular: any
    ) {
        //
    }

    // without enterprise login
    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('setting').withHttpConfig(httpConfig).getList(param);
    }




}
