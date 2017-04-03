import {IBread,BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';

export class BreadcrumbController {

  public bread: IBread[];

  /* @ngInject */
  constructor(private breadcrumbService: BreadcrumbService) {
    var vm = this;
    vm.bread = vm.breadcrumbService.get();
  }


}
