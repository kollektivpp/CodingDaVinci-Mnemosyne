'use strict'

angular.module('mnemosyneApp')
    .directive('nodeDoc', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/partials/node-doc.html',
        };
    });