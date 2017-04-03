export interface IBread {
  title: string;
  url?: string;
}

export class BreadcrumbService {

  public bread: IBread[];
  public article: IBread[];

  /* @ngInject */
  constructor(private Restangular: restangular.IService,
              private $translate: angular.translate.ITranslateService) {
    var vm = this;
    vm.bread = [
      {
        title: 'navbar.index',
        url: '/'
      }
    ];
  }

  get() {
    return this.bread;
  }

  set(article: IBread) {
    var vm = this;
    vm.bread.push(article);
  }

  clear() {
    this.bread.splice(1, this.bread.length);
    return this.bread;
  }


}
