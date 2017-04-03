
export class DashboardTabsService {

    public dashboard: string;

    /* @ngInject */
    constructor() {
        var vm = this;

    }
    set(data: string) {
        var vm = this;
        vm.dashboard = data;
    }

    get(): string {
        var vm = this;
        return vm.dashboard;
    }



}
