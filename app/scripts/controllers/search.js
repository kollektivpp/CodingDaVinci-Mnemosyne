'use strict';

angular.module('mnemosyneApp')
  .controller('SearchCtrl', function ($scope, $http, $compile, DDBParser, MnemosyneRequest, EventSystem, NodeFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];  

    $scope.requestDepth = 1;
    $scope.searchTerm = "";
    $scope.loadingStopped = true;

    $scope.triggerSearch = function(event) {

        var searchString = angular.element(document.querySelector('.overlay-search-selector input')).val();
        //TODO: Implement random search
        
        // Starting the Mnemosyne request:
        var request = new MnemosyneRequest(searchString, angular.copy($scope.requestDepth), function(result) {
            $scope.fullData = result;
            $scope.displayResult(result);
            $scope.loadingStopped = true;
        });

        $scope.result1 = {};
        $scope.result2 = {};
        $scope.result3 = {};
        $scope.result4 = {};
        $scope.result5 = {};

        request.startSearch();
        $scope.loadingStopped = false;
    };

    $scope.standardButtonClick = function(event) {
        var clickedButton = angular.element(event.srcElement),
            overlay = clickedButton.next(),
            searchButton = angular.element(document.querySelector('#button-search')),
            allButtons = angular.element(document.querySelectorAll('.standard-button')),
            allOverlays = angular.element(document.querySelectorAll('.standard-overlay'));

        if (clickedButton[0] !== searchButton[0]) {
            searchButton.html("RESTART");
        }

        if (clickedButton.hasClass('active')) {
            clickedButton.removeClass('active');
            overlay.addClass('hidden');
        } else {
            allButtons.removeClass('active');
            allOverlays.addClass('hidden');

            clickedButton.addClass('active');
            overlay.removeClass('hidden');
        }
    };

    $scope.searchButtonClick = function(event) {
        var searchButton = angular.element(event.srcElement),
            overlay = searchButton.next();

            if (searchButton.hasClass('active')
                && (angular.element(overlay.children()[0]).hasClass('selected')
                    || angular.element(overlay.children()[1]).hasClass('selected'))) {
                $scope.triggerSearch();
                searchButton.html("RESTART");
            } else if (!searchButton.hasClass('active')
                && (angular.element(overlay.children()[0]).hasClass('selected')
                    || angular.element(overlay.children()[1]).hasClass('selected'))) {
                searchButton.html("GO");
            }
    };

    $scope.selectSearchStyle = function(event) {
        var searchStyleElements = angular.element(document.querySelectorAll('.overlay-search-selector')),
            clickedElement = (angular.element(event.srcElement).hasClass('.overlay-search-selector'))
                            ? angular.element(event.srcElement)
                            : angular.element(event.srcElement).parent(),
            searchButton = angular.element(document.querySelector('#button-search'));

        if (clickedElement.hasClass('selected')) {
            clickedElement.removeClass('selected');
            searchButton.html("RESTART");
        } else {
            searchStyleElements.removeClass('selected');
            clickedElement.addClass('selected');
            searchButton.html("GO");
        }
    };

    $scope.increaseSearchDepth = function(event) {
        $scope.requestDepth = Math.min(5, $scope.requestDepth + 1);
        $scope.displaySearchDepth();
    };

    $scope.decreaseSearchDepth = function(event) {
        $scope.requestDepth = Math.max(1, $scope.requestDepth - 1);
        $scope.displaySearchDepth();
    };

    $scope.displaySearchDepth = function() {
        var depthIndicatorSteps = angular.element(document.querySelectorAll('.depth-indicator-step')),
            knobElement = angular.element(document.querySelector('.knob')),
            knobPositionDegree,
            singleStep,
            i,
            length = 5;

        for (i = 0; i < length; i++) {
            singleStep = angular.element(depthIndicatorSteps[i]);

            if (i <= $scope.requestDepth - 1) {
                singleStep.addClass('active');
            } else {
                singleStep.removeClass('active');
            }
        }

        knobPositionDegree = - 60 + (20 * $scope.requestDepth);
        knobElement.css({
            "-webkit-transform": "rotate(" + knobPositionDegree + "deg)"
        })
    };

    $scope.displayResult = function(result) {
        
        var requestThreadDepth = result[0].requestResults.length;
                
        $scope.result1 = NodeFactory.createNodeWithOutcome(result[0].requestResults[requestThreadDepth - 1].outcome);
        $scope.result2 = NodeFactory.createNodeWithOutcome(result[1].requestResults[requestThreadDepth - 1].outcome);
        $scope.result3 = NodeFactory.createNodeWithOutcome(result[2].requestResults[requestThreadDepth - 1].outcome);
        $scope.result4 = NodeFactory.createNodeWithOutcome(result[3].requestResults[requestThreadDepth - 1].outcome);
        $scope.result5 = NodeFactory.createNodeWithOutcome(result[4].requestResults[requestThreadDepth - 1].outcome);
    };
  });
