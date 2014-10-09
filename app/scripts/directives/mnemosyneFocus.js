angular.module('mnemosyneApp')
    .directive('mnemosyneFocus', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watch(attr.mnemosyneFocus, function (n, o) {
                    if (n != 0 && n) {
                        console.log("focus");
                        element[0].focus();
                    }
                });
            }
        };
});

angular.module('mnemosyneApp')
    .directive('mnemosyneBlur', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('blur', function () {
                    //apply scope (attributes)
                    scope.$apply(attr.mnemosyneBlur);
                    //return scope value for focusing to false
                    scope.$eval(attr.mnemosyneFocus + '=false');
                });
            }
        };
});