import {MessageService} from './service/global.service';
angular.module('frontend')
    .service('messageService', MessageService)
    .filter('escapeHtml', function () {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        return function (str) {
            return String(str).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }
    })
    .filter('htmlToPlaintext', function () {
        return function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }
    })
    .filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
})
    .directive('scrollOnClick', function() {
        return {
            restrict: 'A',
            link: function(scope, $elm, attrs) {
                var idToScroll = attrs.href;
                $elm.on('click', function() {
                    var $target;
                    if (idToScroll) {
                        $target = $(idToScroll);
                    } else {
                        $target = $elm;
                    }
                    $("body").animate({scrollTop: $target.offset().top}, "slow");
                });
            }
        }
    })
    .directive('scrollToTop', function() {
        return {
            restrict: 'A',
            link: function(scope, $elm) {
                $elm.on('click', function() {
                    $("body").animate({scrollTop: 0}, "slow");
                });
            }
        }
    });
