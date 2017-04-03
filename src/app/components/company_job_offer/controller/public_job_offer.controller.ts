import {MetaService} from '../../../main/meta.service';


export class PublicJobOfferController {


    /* @ngInject */
    constructor(
                private MetaService: MetaService,
                private $translate: angular.translate.ITranslateService,
                private toaster: ngtoaster.IToasterService,
                private localStorageService: any,
                private $state: ng.ui.IStateService,
                private $timeout: angular.ITimeoutService) {
        var vm = this;
        MetaService.pageTitle = vm.$translate.instant('enterprise.position_offer');
    }

}
