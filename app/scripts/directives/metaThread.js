'use strict'

angular.module('mnemosyneApp')
    .directive('metaThread', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                metaData: '=metadata',
                threadIndex: '=threadindex'
            },
            templateUrl: 'views/partials/meta-thread.html'
        };
    });