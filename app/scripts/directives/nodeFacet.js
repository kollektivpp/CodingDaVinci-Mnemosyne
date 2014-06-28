'use strict'

angular.module('mnemosyneApp')
    .directive('nodeFacet', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/partials/node-facet.html',
            // controller: function($scope) {
            //     //controller for your sub area.
            // }
        };
    });