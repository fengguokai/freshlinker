export class UserArticleService {

    /* @ngInject */
    constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
        //
    }

    get(param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.all('user/posts').withHttpConfig(httpConfig).getList(param);
    }


    find(articleId: string, param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('user/posts', articleId).withHttpConfig(httpConfig).get(param);
    }

    store(data: Object): ng.IPromise<any> {
        return this.Restangular.one('user/posts').customPOST(data);
    }

    update(articleId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('user/posts', articleId).customPUT(data);
    }

    destroy(articleId: string): ng.IPromise<any> {
        return this.Restangular.one('user/posts', articleId).remove();
    }


    getArticleCategory( param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.all('public/post_categories').withHttpConfig(httpConfig).getList(param);
    }


    getArticleCategoryTree( param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.all('public/post_categories/tree').withHttpConfig(httpConfig).getList(param);
    }

    findArticleCategory(categoryId: string,  param?: Object, httpConfig?: Object): ng.IPromise<any> {
        return this.Restangular.one('public/post_categories', categoryId).withHttpConfig(httpConfig).get(param);
    }

    upload(articleId: string, files, data: Object): ng.IPromise<any> {
        var fd = new FormData();
        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);
        }
        return this.Restangular.one('user/posts', articleId).one('cover').withHttpConfig({transformRrequest: angular.identity}).customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    editArticle(articleId: string,  param?: Object, httpConfig?: Object): ng.IPromise<any> {
    return this.Restangular.one('user/posts', articleId).one('modify_active', '').withHttpConfig(httpConfig).customPUT(param);
}



}
