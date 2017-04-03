import {MetaService} from '../../../main/meta.service';

export class JobFlatformController {



    /* @ngInject */
    constructor(private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService) {

        var vm = this;
        // set page config
        MetaService.pageTitle = vm.$translate.instant('about_us.job_flatform');
    }




}