'use strict'

angular.module('mnemosyneApp')
    .directive('metaStart', function() {
        return {
            restrict: 'E',
            scope: {
                metaData: '=metadata'
            },
            templateUrl: 'views/partials/meta-start.html',
        };
    });