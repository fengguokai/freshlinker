import {MetaService} from '../../../main/meta.service';


export class PromptCompanyController {
    public companyId: string;

    /* @ngInject */
    constructor(private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private localStorageService: any) {

        var vm = this;
        if(vm.localStorageService.get('company') !== null) vm.companyId = vm.localStorageService.get('company');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.prompt');

    }




}
