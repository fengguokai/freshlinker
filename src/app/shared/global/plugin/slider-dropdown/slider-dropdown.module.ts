export interface ISliderDropDownDirective extends ng.IScope {
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
}

export class SliderDropDownDirective implements ng.IDirective {

    static $inject = ['$document', 'sliderDropdownService'];

    restrict = 'AE';
    scope = {
        title: '=?',
        icon: '=',
        isRange: '=',
        tabs: '=',

        //selectedMaxSalary: '=?',
        //selectedMinSalary: '=?',
        //selectedSalaryType: '=?',
        //monthOptions: '=?',
        //hourOptions: '=?'
    };
    replace = false;
    template = `<style>
            .searchPositionSalary{
                display:none;
            }
            .searchActive{
                display: block !important;
            }
            </style>
           <article class="searchSalary  input-group input clearfix">
              <div class="input-group-addon" >
                <i class="{{ icon }}"></i>
              </div>
              <div class="searchCategoryOpened pull-left">
                <div class="searchTextShow" >
                <div ng-repeat="tab in tabs">
                <p ng-if="selectedTabIndex === $index">
                    <span>Monthly</span>
                      <span>$
                      {{tab.value1}}
                      </span>
                      <span>to</span>
                      <span>$
                        {{tab.value2 === 100000 ? tab.value2 + '+' : tab.value2 }}
                      </span>
                      </p>
                </div>
                    <!--<p ng-if="selectedSalaryType === 'monthly'">-->
                      <!--<span>Monthly</span>-->
                      <!--<span>$-->
                      <!--{{selectedMinSalary}}-->
                      <!--</span>-->
                      <!--<span>to</span>-->
                      <!--<span>$-->
                        <!--{{selectedMaxSalary === 100000 ? selectedMaxSalary + '+' : selectedMaxSalary }}-->
                      <!--</span>-->
                    <!--</p>-->
                    <!--<p ng-if="selectedSalaryType === 'hourly'">-->
                      <!--<span>Hourly</span>-->
                      <!--<span>$ {{selectedMinSalary}}</span>-->
                      <!--<span>to</span>-->
                      <!--<span>$-->
                        <!--{{selectedMaxSalary === 100 ? selectedMaxSalary + '+' : selectedMaxSalary}}-->
                      <!--</span>-->
                    <!--</p>-->
                </div>
              </div>
              <div class="input-group-addon pull-right">
                <i class="fa fa-caret-down"></i>
              </div>
            </article>


            <div class="searchPositionSalary">
              <div class="searchPositionSalaryContent ">
                <div class="salaryList">
                  <a  href="" class="month" ng-class="{'active': selectedSalaryType === 'monthly'}" ng-click="switchSalaryType('monthly')">
                    Monthly
                  </a>
                  <a href="" class="hour" ng-class="{'active': selectedSalaryType === 'hourly'}" ng-click="switchSalaryType('hourly')">
                    Hourly
                  </a>
                </div>
                       <div ng-repeat="tab in tabs">
                            <rzslider ng-if="selectedTabIndex === $index" rz-slider-model="tab.value"
                            rz-slider-high="tab.value2"
                            rz-slider-options="tab.options"></rzslider>
                       </div>
                <!--<div ng-if="selectedSalaryType === 'monthly'">-->
                  <!--<rzslider rz-slider-model="selectedMinSalary"-->
                            <!--rz-slider-high="selectedMaxSalary"-->
                            <!--rz-slider-options="monthOptions"></rzslider>-->
                <!--</div>-->
                <!--<div ng-if="selectedSalaryType === 'hourly'">-->
                  <!--<rzslider rz-slider-model="selectedMinSalary"-->
                            <!--rz-slider-high="selectedMaxSalary"-->
                            <!--rz-slider-options="hourOptions"></rzslider>-->
                <!--</div>-->

              </div>
            </div>

            `;

    constructor(private $document: any, private sliderDropdownService: any) {
        //
    }

    link = (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any, $translate: any) => {
        var vm = this;

        //scope.tab =

        scope.selectedTabIndex = 0;
        scope.switchTab = function (tabIndex: number) {
            scope.selectedTabIndex = tabIndex;
        };


        scope.switchSalaryType = function (type: string) {
            scope.selectedSalaryType = type;
            scope.initSalaryRange(type);
        };

        scope.initSalaryRange = function (type: string) {
            scope.selectedMinSalary = 0;
            scope.selectedMaxSalary = type === 'monthly' ? 100000 : 100;
        };

        if (_.isUndefined(scope.selectedType)) scope.selectedType = [];

        // Begin UI Control
        var dropdownContentElement = angular.element(angular.element(element).find('.searchPositionSalary')[0]);
        var dropdownMenuElement = angular.element(angular.element(element).find('.searchSalary')[0]);

        this.sliderDropdownService.register(dropdownContentElement);

        dropdownMenuElement.bind('click', function (event) {
            event.stopPropagation();
            vm.sliderDropdownService.toggleActive(dropdownContentElement);
        });

        scope.toggle = function () {
            vm.sliderDropdownService.toggleActive(dropdownContentElement);
        };


        scope.$on('$destroy', function () {
            vm.sliderDropdownService.unregister(dropdownContentElement);
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
        scope.setParent = function (children: any, parent: any) {
            angular.forEach(children, function (child: any) {
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
        scope.setSelectedItems = function (children: any, parent: any, selectedItemIds: any[]) {
            if (!_.isUndefined(selectedItemIds)) {
                angular.forEach(children, function (child: any) {
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
        scope.toggleItem = function (item: any): void {
            scope.opendedItems = [];
            _.each(scope.items, function (value: any, index: number) {
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

        scope.addSelectedItem = function (data: any) {
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

    static factory(): ng.IDirectiveFactory {
        const directive = ($document: any, sliderDropdownService: any) => new SliderDropDownDirective($document, sliderDropdownService);
        directive.$inject = ['$document', 'sliderDropdownService'];
        return directive;
    }
}

export class SliderDropdownService {

    private _dropdowns: any = [];

    /* @ngInject */
    constructor(private $document: any) {
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
    .service('sliderDropdownService', SliderDropdownService)
    .directive('sliderDropdown', SliderDropDownDirective.factory());