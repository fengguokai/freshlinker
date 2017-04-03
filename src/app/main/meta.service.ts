export class MetaService {

  public pageTitle: string = '';
  public siteTitle: string = 'Freshlinker';
  public description: string = '';
  public url: string = '';

  /* @ngInject */
  constructor(private $location: ng.ILocationService) {
  }

  getFullTitle() {
    return (this.pageTitle !== '' ? this.pageTitle + ' | ' : '') + this.siteTitle;
  }

  getCurrentUrl(){
    return this.$location.absUrl();
  }

}


