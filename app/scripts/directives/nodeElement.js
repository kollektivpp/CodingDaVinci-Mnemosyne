'use strict'

angular.module('mnemosyneApp')
    .directive('nodeElement', function() {
        return {
            restrict: 'E',
            scope: {
                outcome: '=result'
            },
            templateUrl: 'views/partials/node-element.html'
        };
    });