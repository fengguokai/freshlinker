export interface IArticle {
    id?: string;
    companyId?: string;
    title?: string;
    slug?: string;
    content?: string;
    view?: number;
    active?: boolean;
    isApproved?: boolean;
    categoryIds?: any;
    tags?: any;
    categories?: any;
    cover?: any;
    noUserName?: boolean;
    userName?: string;
    user?: IUser;
    company?: ICompany;
}

export interface IUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface ICompany {
    id?: number;
    name?: string;
}

export interface IArticleCategory {
    id?: string;
    name?: string;
    parentId?: string;

}

export class ArticleService {

    /* @ngInject */
    constructor(
        private Restangular: any,
        private localStorageService: any,
        private $q: ng.IQService,
        private PublicRestangular: any) {
        //
    }

    get( param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.PublicRestangular.all('posts').withHttpConfig(httpConfig).getList(param);
    }


    find( articleId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.PublicRestangular.one('posts', articleId).withHttpConfig(httpConfig).get(param);
}


    getClickNum( articleId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.PublicRestangular.one('posts', articleId).one('click_traffic', '').withHttpConfig(httpConfig).customPOST(param);
    }

    getUserName(value: IArticle): string {
        if(value.user !== null) {
            value.noUserName = value.user.firstName === null ? true : false;
            if(value.noUserName) {
                var user = value.user.email.split('@');
                value.userName = user[0];
            } else {
                value.userName = value.user.firstName + '' + value.user.lastName;
            }
        } else {
            value.userName = value.company.name;
        }
        return value.userName;
    }


}
