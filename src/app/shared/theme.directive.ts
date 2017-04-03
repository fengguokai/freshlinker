export class SlideOutNavDirective implements ng.IDirective {

  static $inject = ['$timeout'];

  restrict = 'A';
  scope = {
    show: '=slideOutNav'
  };

  constructor($timeout: ng.ITimeoutService) {
    //
  }

  link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
    scope.$watch('show', function (newVal: any, oldVal: any) {
      var self = this;
      if (newVal) {
        element.slideDown({
          complete: function () {
            self.$timeout(function () {
              scope.$apply();
            });
          }
        });
      } else if (!newVal) {
        element.slideUp({
          complete: function () {
            self.$timeout(function () {
              scope.$apply();
            });
          }
        });
      }
    });
  }
}

