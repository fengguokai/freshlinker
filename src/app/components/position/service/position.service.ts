export interface IPosition {
    id?: string;
    name?: string;
    type?: string;
    minSalary?: string;
    maxSalary?: string;
    educationId?: string;
    temptation?: string;
    experience?: string;
    address?: string;
    description?: string;
    companyId? : string;
    educationLevelId: number;
    updatedAt?: Date;
    createdAt?: Date;
    categories?: any;
    company?: any;
    expiredDate?: Date;
    salaryType?: string;
    bookmarkStatus?: boolean;
    jobNatureId?: number;
    skills?: any;
    status?: any;
    tags?: any;
}

export interface IJobNature {
    id?: number;
    name?: string;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IExperience {
    id: number;
    value?: string;
    name?: string;
}

export interface ISkill {
    id?: string;
    name?: string;
}




export interface IResponsiveItem {
    slidesToShow?: number;
    slidesToScroll?: number;
    infinite?: boolean;
    dots?: boolean;
}

export interface IResponse {
    breakpoint?: number;
    settings: IResponsiveItem;
}

export interface IResponsive {
    infinite?: boolean;
    speed?: number;
    breakpoint?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    dots?: boolean;
    responsive?: IResponse[];
}


export class PositionService {
    public slick: IResponsive;
    /* @ngInject */
    constructor(
        private Restangular: any,
        private PublicRestangular: any,
        private $translate: any) {
        this.slick = {
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 5,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        };
    }



    get(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('positions').withHttpConfig(httpConfig).getList(param);
    }


    // search position
    getSearch(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('positions').withHttpConfig(httpConfig).getList(param);
    }

    find(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.one('positions', id).withHttpConfig(httpConfig).get(param);
    }

    store(data: Object): ng.IPromise<any> {
        return this.Restangular.all('positions').post(data);
    }

    // company not login
    getByUserPosition(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', 'self').all('positions').withHttpConfig(httpConfig).getList(param);
    }

    // enterprises need login
    getByCompanyPosition(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('enterprise/companies', id).all('positions').withHttpConfig(httpConfig).getList(param);
    }

    // get user applied position
    getByUserAppliedPosition(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('user/candidates').withHttpConfig(httpConfig).getList(param);
    }

    // get user applied position candidateNum
    getByUserAppliedPositionCandidateNum(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.all('user/candidates/list').withHttpConfig(httpConfig).getList(param);
    }

    // educationChart,experienceChart
    getChart(positionId: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.one('positions', positionId).one('chart').withHttpConfig(httpConfig).get(param);
    }



    // public position
    getOtherPosition(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.Restangular.one('public/companies', id).all('positions').withHttpConfig(httpConfig).getList(param);
    }


    // similar_position
    getRelatedPosition(param?: Object, httpConfig?: restangular.IRequestConfig):ng.IPromise<any> {
        return this.PublicRestangular.one('positions/by_similar_position').withHttpConfig(httpConfig).get(param);
    }


    getPositionInvitation(param?: Object, httpConfig?: restangular.IRequestConfig):ng.IPromise<any> {
        return this.Restangular.one('public/positionInvitation', 'positions').withHttpConfig(httpConfig).get(param);
    }

    getPositionClickNum(positionId: string, param?: Object, httpConfig?: restangular.IRequestConfig):ng.IPromise<any> {
        return this.Restangular.one('public/positions', positionId).all('click_traffic', '').withHttpConfig(httpConfig).customPOST(param);
    }

    // get category position
    getCategroyPosition(param?: Object, httpConfig?: restangular.IRequestConfig):ng.IPromise<any> {
        return this.PublicRestangular.one('positions/categories_position').withHttpConfig(httpConfig).get(param);
    }

    // getjobNatures
    getjobNatures(param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.all('jobNatures').withHttpConfig(httpConfig).getList(param);
    }

    findJobNature(id: string, param?: Object, httpConfig?: restangular.IRequestConfig): ng.IPromise<any> {
        return this.PublicRestangular.one('jobNatures', id).withHttpConfig(httpConfig).get(param);
    }


}
