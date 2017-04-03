export interface IBookmark {
    id?: string;
    positionId?: string;
    userId?: string;
}



export class BookmarkService {

    /* @ngInject */
    constructor(
        private Restangular: any,
        private PublicRestangular: any) {
        //
    }

    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('user/bookmarks').withHttpConfig(httpConfig).getList(param);
    }

    store(positionId, data?: Object): ng.IPromise<any> {
        return this.Restangular.one('user/positions', positionId).one('bookmark', '').customPOST(data);
    }

    destroy(positionId: string): ng.IPromise<any> {
        return this.Restangular.one('user/positions', positionId).one('bookmark', '').remove();
    }

    find(positionId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('user/positions', positionId).one('bookmark', '').withHttpConfig(httpConfig).get(param);
    }


    check(positionId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('user/users', 'self').one('positions', positionId).one('bookmark').withHttpConfig(httpConfig).get(param);
    }




}




