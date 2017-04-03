export interface ICustomDropDownDirective extends ng.IScope {
  showMe:boolean;
  toggle: () => void;
  treeUrl: string;
  setParent: () => void;
  value: any;
  selectedCategoryIds: any[];
  isOpenedDropdown: boolean;
  openDropdown: () => void;
  opendedItems: any[];
  setSelectedItems: () => void;
  selectedItems: any[];
  items: any[];
  selectedLimitShow: boolean;
  default: any[];
  selectedType: string;
  searchPositionType: string;
}

export class CustomDropDownDirective implements ng.IDirective {

  static $inject = ['$document', 'customDropdownService'];

  restrict = 'AE';
  scope = {
    title: '=',
    icon: '=',
    items: '=',
    defaultSelectedIds: '=?',
    selectedItems: '=?checked',
    selectedType: '=?selected',
    type: '=?',
    selectedMaxSalary: '=?',
    selectedMinSalary: '=?',
    selectedSalaryType: '=?',
    searchPositionType: '=?searched'
  };
  replace = false;
  template = `<style>
            .searchPositionCategory{
                display:none;
            }
            .searchActive{
                display: block !important;
            }
            </style>
            <article class="searchCategory input-group input clearfix">
              <div class="input-group-addon">
                <i class="{{ icon }}"></i>
              </div>
              <div style="z-index:997;" class="searchCategoryOpened pull-left">
                  <div class="searchTextShow" ng-show="type === 'checkbox'">

                    <span ng-show="selectedItems.length === 0">{{ title }}</span>
                    <span ng-repeat="list in selectedItems track by $index" class="searchTextShow">{{list.name}}</span>
                  </div>
                  <p class="searchTextShow" ng-show="type === 'radio'">
                    <span>{{selectedType.length === 0 ? title : selectedType}}</span>
                  </p>


              </div>
              <div class="input-group-addon pull-right">
                <i class="fa fa-caret-down"></i>
              </div>
            </article>





            <div class="searchPositionCategoryMain">
              <div class="searchPositionCategory" ng-class="{'noBorder': type === 'radio'}">
                <ul class="searchPositionCategoryContent list-unstyled" ng-show="type !== 'radio'">
                  <div ng-show="selectedItems.length !== 0 && type !== 'radio'">
                    <ul class="list-inline childList">
                      <li ng-repeat="child in selectedItems track by $index" class="list" ng-click="addSelectedItem(child)">
                        {{child.name}}
                        <i class="fa fa-close"></i>
                      </li>
                      <li ng-show="selectedItems.length === 5" class="limitShow">
                        {{'search.up_to_five' | translate}}
                      </li>
                      <li class="btn" ng-click="toggle()">
                        <button type="button" class="finish btn" >done
                        </button>
                      </li>
                    </ul>
                  </div>

                  <li class="searchPositionCategoryList" ng-repeat="item in items"
                      ng-include="'app/shared/global/plugin/custom-dropdown/search-tree.html'">
                  </li>
                </ul>

                <ul class="searchPositionEmploymentContent searchPositionCategoryContent list-unstyled" ng-show="type === 'radio' && searchPositionType === 'type'">
                    <li class="searchEducationCategoryList">
                      <label>
                        <input type="radio" name="type" value="full-time" ng-model="selectedType" ng-checked="selectedType === 'full-time'">
                        Full Time
                      </label>
                    </li>
                    <li class="searchEducationCategoryList">
                      <label>
                        <input type="radio" name="type" value="part-time" ng-model="selectedType" ng-checked="selectedType === 'part-time'">
                        Part Time
                      </label>
                    </li>

                    <li class="searchEducationCategoryList">
                      <label>
                        <input type="radio" name="type" value="internship" ng-model="selectedType" ng-checked="selectedType === 'internship'">
                        Internship
                      </label>
                    </li>

                    <li class="searchEducationCategoryList">
                      <label>
                        <input type="radio" name="type" value="freelance" ng-model="selectedType" ng-checked="selectedType === 'freelance'">
                        Freelance
                      </label>
                    </li>

                    <li class="searchEducationCategoryList">
                      <label>
                        <input type="radio" name="type" value="other" ng-model="selectedType" ng-checked="selectedType === 'other'">
                        Other
                      </label>
                    </li>
                  </ul>



              </div>
            </div>`;

  constructor(private $document:any, private customDropdownService:any) {
    //
  }

  link = (scope:any, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ctrl:any, $translate: any) => {
    var vm = this;

    if(_.isUndefined(scope.selectedType)) scope.selectedType = [];

    // Begin UI Control
    var dropdownContentElement = angular.element(angular.element(element).find('.searchPositionCategory')[0]);
    var dropdownMenuElement = angular.element(angular.element(element).find('.searchCategory')[0]);

    this.customDropdownService.register(dropdownContentElement);

    dropdownMenuElement.bind('click', function (event) {
      event.stopPropagation();
      vm.customDropdownService.toggleActive(dropdownContentElement);
    });

    scope.toggle = function() {
      vm.customDropdownService.toggleActive(dropdownContentElement);
    };


    scope.$on('$destroy', function () {
      vm.customDropdownService.unregister(dropdownContentElement);
    });
    // End UI Control

    scope.opendedItems = [];
    if (_.isUndefined(scope.selectedItems)) scope.selectedItems = [];

    /**
     * init parent field
     *
     * @param children
     * @param parent
     * @return void
     */
    scope.setParent = function (children:any, parent:any) {
      angular.forEach(children, function (child:any) {
        child.parent = parent;
        child.isShowChilren = false;
        if (typeof child.children !== 'undefined') {
          scope.setParent(child.children, child);
        } else {
          child.children = [];
        }
      });
    };

    /**
     * batch select item
     *
     * @param children
     * @param parent
     * @param selectedItemIds
     * @return void
     */
    scope.setSelectedItems = function (children:any, parent:any, selectedItemIds:any[]) {
      if (!_.isUndefined(selectedItemIds)) {
        angular.forEach(children, function (child:any) {
          if (selectedItemIds.indexOf(child.id.toString()) !== -1) {
            child.selected = true;
            scope.selectedItems.push(child);
          }
          if (typeof child.children !== 'undefined') {
            scope.setSelectedItems(child.children, child, selectedItemIds);
          }
        });
      }
    };

    /**
     * toggle item (opened / closed)
     *
     * @param item
     * @return void
     */
    scope.toggleItem = function (item:any):void {
      scope.opendedItems = [];
      _.each(scope.items, function (value:any, index:number) {
        if (value.parent === null) {
          scope.opendedItems.push(value);
        }

      });

      if (item) {
        if (item.isShowChildren) {
          item.isShowChildren = false;
          return;
        }
        for (var i = scope.opendedItems.length - 1; i >= 0; i--) {
          if (item.id === scope.opendedItems[i].id) {
            scope.opendedItems[i].isShowChildren = true;
          } else {
            scope.opendedItems[i].isShowChildren = false;
          }
        }

        var parent = item;
        while (parent !== null) {
          parent.isShowChildren = true;
          scope.opendedItems.push(parent);
          parent = parent.parent;
        }

      }
    };

    scope.addSelectedItem = function (data:any) {
      var result = _.findIndex(scope.selectedItems, {id: data.id});
      if (result === -1) {
        if (scope.selectedItems.length < 5) {
          data.selected = true;
          scope.selectedItems.push(data);
        }
      } else {
        data.selected = false;
        scope.selectedItems.splice(result, 1);
      }
    };


    scope.setParent(scope.items, null);
    scope.setSelectedItems(scope.items, null, scope.defaultSelectedIds);

  };

  static factory():ng.IDirectiveFactory {
    const directive = ($document:any, customDropdownService:any) => new CustomDropDownDirective($document, customDropdownService);
    directive.$inject = ['$document', 'customDropdownService'];
    return directive;
  }
}

export class CustomDropdownService {

  private _dropdowns:any = [];

  /* @ngInject */
  constructor(private $document:any) {
    var vm = this;
    var body = $document.find('body');

    body.bind('click', function (e) {
      var parentNode = angular.element(e.target.closest('.searchPositionCategory'));
      angular.forEach(vm._dropdowns, function (el) {
        if (!el.is(parentNode)) el.removeClass('searchActive');
      });
    });

  }

  register(ddEl) {
    var vm = this;
    vm._dropdowns.push(ddEl);
  };

  unregister(ddEl) {
    var vm = this;
    var index;
    index = vm._dropdowns.indexOf(ddEl);
    if (index > -1) {
      vm._dropdowns.splice(index, 1);
    }
  };

  toggleActive(ddEl) {
    var vm = this;
    //console.log('c', ddEl);
    angular.forEach(vm._dropdowns, function (el) {
      //console.log('loop', el, el.is(ddEl), el === ddEl);
      if (!el.is(ddEl)) {
        el.removeClass('searchActive');
      }
    });

    ddEl.toggleClass('searchActive');
  };

  clearActive() {
    var vm = this;
    angular.forEach(vm._dropdowns, function (el) {
      el.removeClass('searchActive');
    });
  };

  isActive(ddEl) {
    return ddEl.hasClass('searchActive');
  };

}

angular.module('frontend')
  .service('customDropdownService', CustomDropdownService)
  .directive('customDropdown', CustomDropDownDirective.factory());