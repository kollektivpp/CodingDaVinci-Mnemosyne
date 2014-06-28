'use strict'

angular.module('mnemosyneApp')
    .directive('nodePerson', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/partials/node-person.html',
        };
    });