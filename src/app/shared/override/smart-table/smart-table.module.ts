export interface IStNextPrevPaginationDirectiveScope extends ng.IScope {
  stItemsByPage: number;
  cantPageForward: boolean;
  cantPageBackward: boolean;
  currentPage: number;
  stDisplayedPages: number;
  stPaginationAction: string;
  setPaginationAction: (action: string) => void;
  prev: () => void;
  next: () => void;
  selectPage: (page: number) => void;
}

export class StNextPrevPaginationDirective implements ng.IDirective {

  static $inject = [];

  restrict = 'AE';
  require = '^stTable';
  scope = {
    stItemsByPage: '=?',
    stPaginationAction: '=?',
    stDisplayedPages: '=?'
  };
  replace = false;
  templateUrl = function (element: ng.IAugmentedJQuery, attrs: any) {
    if (attrs.stTemplate) {
      return attrs.stTemplate;
    }
    return 'app/shared/override/smart-table/pagination.html';
  };

  constructor() {
    //
  }

  link = (scope: IStNextPrevPaginationDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) => {

    scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : 10;
    scope.stDisplayedPages = scope.stDisplayedPages ? +(scope.stDisplayedPages) : 5;
    scope.currentPage = 1;
    scope.cantPageForward = true;
    scope.cantPageBackward = true;

    scope.setPaginationAction = function splice(action: string): void {
      scope.stPaginationAction = action;
      ctrl.slice((scope.currentPage - 1) * scope.stItemsByPage, scope.stItemsByPage);
    };

    function redraw(): void {
      var paginationState = ctrl.tableState().pagination;
      scope.cantPageBackward = scope.currentPage === 1;
      if (!_.has(paginationState, 'next')) {
        scope.cantPageForward = true;
      } else {
        scope.cantPageForward = paginationState.next === null;
      }
    }

    scope.prev = function () {
      scope.currentPage = Math.max(scope.currentPage - 1, 1);
      if (scope.currentPage !== 1) {
        scope.setPaginationAction('prev');
      } else {
        scope.setPaginationAction('');
      }
    };
    scope.next = function () {
      scope.currentPage += 1;
      scope.setPaginationAction('next');
    };

    // table state --> view
    scope.$watch(function () {
      return ctrl.tableState().pagination;
    }, redraw, true);

    // scope --> table state  (--> view)
    scope.$watch('stItemsByPage', function (newValue: any, oldValue: any) {
      if (newValue !== oldValue) {
        scope.selectPage(1);
      }
    });

    // view -> table state
    scope.selectPage = function (page: number) {
      if (page > 0) {
        ctrl.slice(0, scope.stItemsByPage);
      }
    };

    if (!ctrl.tableState().pagination.number) {
      ctrl.slice(0, scope.stItemsByPage);
    }
  };

  static factory(): ng.IDirectiveFactory {
    var directive = () => {
      return new StNextPrevPaginationDirective();
    };

    return directive;
  }
}

export interface IStSelectAllDirectiveScope extends ng.IScope {
  rows: Array<any>;
  countSelectedRows: number;
  isAllSelected: boolean;
}

export class StSelectAllDirective implements ng.IDirective {

  static $inject = [];

  restrict = 'AE';
  require = '^stTable';
  scope = {
    rows: '=all',
    ngModel: '=',
    countSelectedRows: '='
  };
  replace = false;
  template = '<input type="checkbox" ng-model="isAllSelected"/>';

  constructor() {
    //
  }

  link = (scope: IStSelectAllDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) => {

    function getAllSelected() {
      return (getTotalRows() === getSelectedRows());
    }

    function getTotalRows() {
      return scope.rows.length;
    }

    function getSelectedRows() {
      var selectedRows = 0;
      scope.rows.forEach(function (row: any) {
        if (row.isSelected) {
          selectedRows++;
        }
      });
      scope.countSelectedRows = selectedRows;
      return selectedRows;
    }

    function setAllRows(bool: boolean): void {
      scope.rows.forEach(function (row: any) {
        if (row.isSelected !== bool) {
          row.isSelected = bool;
        }
      });
    }

    scope.$watch('rows', function () {
      scope.isAllSelected = getAllSelected();
    }, true);

    scope.$watch('isAllSelected', function () {
      if (scope.isAllSelected) {
        setAllRows(true);
      } else {
        if (getAllSelected()) {
          setAllRows(false);
        }
      }
    });
  };

  static factory(): ng.IDirectiveFactory {
    var directive = () => {
      return new StSelectAllDirective();
    };

    return directive;
  }
}

export class StCustomActionDirective implements ng.IDirective {

  static $inject = [];

  restrict = 'AE';
  require = '^stTable';
  scope = {
    callback: '&'
  };
  replace = false;

  constructor() {
    //
  }

  link = (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) => {
    element.on('click', function (ev: any) {
      scope.callback.call().then(function () {
        ctrl.pipe();
      });
    });
  };

  static factory(): ng.IDirectiveFactory {
    var directive = () => {
      return new StCustomActionDirective();
    };

    return directive;
  }
}

angular.module('smart-table')
  .directive('stNextPrevPagination', StNextPrevPaginationDirective.factory())
  .directive('stSelectAll', StSelectAllDirective.factory())
  .directive('stCustomAction', StCustomActionDirective.factory());


