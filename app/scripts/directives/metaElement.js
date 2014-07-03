'use strict'

angular.module('mnemosyneApp')
    .directive('metaElement', function(RandomOutcome) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                elementData: '=elementdata',
                elementIndex: '=elementindex'
            },
            templateUrl: 'views/partials/meta-element.html',
            link: function($scope, element, attributes) {
                $scope.outcome = RandomOutcome.getRandomOutcome;
                $scope.random = RandomOutcome.getRandomBoolHigh;
            }
        };
    });