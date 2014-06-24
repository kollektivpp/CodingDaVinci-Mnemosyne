'use strict';

angular.module('mnemosyneApp')
  .controller('SearchCtrl', function ($scope, $http, DDBParser, MnemosyneRequest, EventSystem, PersonNode) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];  

    $scope.requestDepth = 5;
    $scope.searchResult = "Hier erscheinen die Ergebnisse";
    $scope.searchTerm = "search Term";
    $scope.loadingStopped = true;

    $scope.triggerSearch = function() {
        // Starting the Mnemosyne request:
        var request = new MnemosyneRequest($scope.searchTerm, angular.copy($scope.requestDepth), function(result) {
            $scope.fullData = result;
            $scope.parseResult(result);
            $scope.loadingStopped = true;
        });

        request.startSearch();
        $scope.loadingStopped = false;
    };

    $scope.standardButtonClick = function(event) {
        var clickedButton = angular.element(event.srcElement),
            overlay = clickedButton.next(),
            allButtons = angular.element(document.querySelectorAll('.standard-button')),
            allOverlays = angular.element(document.querySelectorAll('.standard-overlay'));

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

    //JUST A DUMMY THING FOR NOW:
    $scope.parseResult = function(result) {

        var person = new PersonNode({
            name: result[0].requestResults[0].searchTerm,
        });

        var person2 = new PersonNode({
            name: result[0].requestResults[1].searchTerm,
        });

        var person3 = new PersonNode({
            name: result[0].requestResults[2].searchTerm,
        });

        var person4 = new PersonNode({
            name: result[0].requestResults[3].searchTerm,
        });

        var person5 = new PersonNode({
            name: result[0].requestResults[4].searchTerm,
        });

        $scope.searchResult = '' + person.name
            + '\n'  + person2.name
            + '\n'  + person3.name
            + '\n'  + person4.name
            + '\n'  + person5.name;
    };
  });
