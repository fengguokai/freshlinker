export class NavbarController {
  public isCollapsed: boolean;
  public filter: any = {};
  public oneAtATime: boolean;

  /* @ngInject */
  constructor(private $state: ng.ui.IStateService,
              private authService: any,
              private $location: any) {
    var vm = this;
    vm.isCollapsed = false;
    vm.oneAtATime = true;


  }

  signin(): void {
    this.authService.openLoginForm();
  }

  openChangePasswordForm(): void {
    this.authService.openChangePasswordForm();
  }

  location(search: string) {
    var vm = this;
    switch(search) {
      case 'all':
          vm.$state.go('main.position-categories');
          break;
      default:
        vm.filter.type = search;
          vm.$state.go('main.positions', vm.filter);
        break;
    }

  }




}
