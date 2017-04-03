export class CompanyPictureService {

    /* @ngInject */
    constructor(private Restangular: any, private localStorageService: any, private $q: ng.IQService) {
        //
    }

    // picture
    uploadCompanyPicture(companyId: string, files, data: Object): ng.IPromise<any> {
        var fd = new FormData();
        for (var i = 0; i < files.length; i++) {
            fd.append('file', files[i]);
        }
        return this.Restangular.one('enterprise/companies',companyId).one('pictures', '')
            .withHttpConfig({transformRrequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    getCompanyPictures(companyId, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).all('pictures').withHttpConfig(httpConfig).getList(param);
    }

    destroy(companyId: string, id: string): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('pictures', id).remove();
    }

    getPictures(companyId, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('public/companies', companyId).all('pictures').withHttpConfig(httpConfig).getList(param);
    }





}
