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
    cover?: any;
    categories?: any;
}

export interface IArticleCategory {
    id?: string;
    name?: string;
    parentId?: string;

}

export class EnterpriseArticleService {

    /* @ngInject */
    constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
        //
    }

    get(companyId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).all('posts').withHttpConfig(httpConfig).getList(param);
    }


    find(companyId: string, articleId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('posts', articleId).withHttpConfig(httpConfig).get(param);
    }

    store(companyId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('posts', '').customPOST(data);
    }

    update(companyId: string, articleId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('posts', articleId).customPUT(data);
    }

    destroy(companyId: string, articleId: string): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('posts', articleId).remove();
    }


    getArticleCategory(param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.all('public/post_categories').withHttpConfig(httpConfig).getList(param);
    }


    getArticleCategoryTree(param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.all('public/post_categories/tree').withHttpConfig(httpConfig).getList(param);
    }

    findArticleCategory(categoryId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('public/post_categories', categoryId).withHttpConfig(httpConfig).get(param);
    }

    uploadCover(companyId: string, articleId: string, files, data: Object): ng.IPromise<any> {
        var fd = new FormData();
        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);
        }
        return this.Restangular.one('enterprise/companies', companyId).one('posts', articleId).one('cover', '').withHttpConfig({transformRrequest: angular.identity}).customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    editArticle(companyId: string, articleId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('posts', articleId).one('modify_active', '').withHttpConfig(httpConfig).customPUT(param);

    }


}
