'use strict'

angular.module('mnemosyneApp')
    .directive('metaElement', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                elementData: '=elementdata',
                elementIndex: '=elementindex'
            },
            templateUrl: 'views/partials/meta-element.html',
        };
    });