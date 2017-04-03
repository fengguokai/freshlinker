export class SiteThemeService {

  private settings = {
    isOpenSidebar: <boolean> true,
    isOpenControlSidebar: <boolean> false,
    isBoxedLayout: <boolean> false,
    isFixedLayout: <boolean> true,
    fullscreen: <boolean> false
  };

  /* @ngInject */
  constructor(private $rootScope: ng.IRootScopeService) {
    //
  }

  get(key: string) {
    return this.settings[key];
  }

  set(key: string, value: any) {
    this.settings[key] = value;
    this.$rootScope.$broadcast('siteThemeService:changed', {
      key: key,
      value: this.settings[key]
    });
    this.$rootScope.$broadcast('siteThemeService:changed:' + key, this.settings[key]);
  }

  values() {
    return this.settings;
  }

}



