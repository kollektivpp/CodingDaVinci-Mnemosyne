'use strict';

angular.module('mnemosyneApp')
    .directive('metaStart', function(RandomOutcome) {

        return {
            restrict: 'E',
            scope: {
                metaData: '=metadata'
            },
            templateUrl: 'views/partials/meta-start.html',
            link: function($scope, element, attributes) {
                $scope.outcome = RandomOutcome.getRandomOutcome;
                $scope.random = RandomOutcome.getRandomBoolHigh;
            }
        };
    });