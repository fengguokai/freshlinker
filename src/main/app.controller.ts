import {MetaService} from './meta.service';

export class AppController {

  public metaService: MetaService;
  /* @ngInject */
  constructor(private MetaService: MetaService, $translate: angular.translate.ITranslateService) {
    var vm = this;

    vm.metaService = MetaService;
  }
}
