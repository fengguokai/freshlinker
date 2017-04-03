export class FooterController {
    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                private localStorageService: any) {
    }

    goState(page: string) {
        var vm = this;
        var isLogin = vm.localStorageService.get('token') === null ? false : true;
        switch (page) {
            case 'jobs':
                if (isLogin) {
                    vm.$state.go('main.position-categories');
                } else {
                    vm.$state.go('main.jobs');
                }
                break;
            case 'industry_feed':
                if (isLogin) {
                    vm.$state.go('main.articles');
                } else {
                    vm.$state.go('main.industry_feed');
                }
                break;
        }

    }

}
