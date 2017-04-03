export interface IPositionQuestion {
    id?: number;
    positionId?: string;
    question?: Array[];
    isRequired?: Array<boolean>;
    candidateId?: string;
}

export interface IPositionQuestionNum {
    id?: number;
    positionId?: string;
    question?: string;
    isRequired?: boolean;
    answer?: string;
}



export class PositionQuestionService {

    /* @ngInject */
    constructor(private Restangular: any,
                private localStorageService: any, private $q: ng.IQService
    ) {
        //
    }

    init(positionId: string): any {
        return this.Restangular.one('enterprise/companies').one('self/questions', positionId);
    }

    get(companyId: string, positionId: string , param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).all('questions').withHttpConfig(httpConfig).getList(param);
    }


    update(companyId: string, positionId: string,questionId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).one('questions', questionId).customPUT(data);
    }



    store(companyId: string, positionId: string, data: Object): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).all('questions').customPOST(data);
    }



    destroy(companyId: string , positionId: string, psoitionQuestionId: string): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', companyId).one('positions', positionId).one('questions',psoitionQuestionId).remove();
    }


    getQuestion(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('user/positions',id).all('questions').withHttpConfig(httpConfig).getList(param);
    }



}
