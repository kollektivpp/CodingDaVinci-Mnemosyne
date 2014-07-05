'use strict'

angular.module('mnemosyneApp')
    .directive('moreElement', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                outcome: '=result'
            },
            templateUrl: 'views/partials/more-element.html'
        };
    });