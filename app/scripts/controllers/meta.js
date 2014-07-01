'use strict';

angular.module('mnemosyneApp')
  .controller('MetaCtrl', function ($scope, $location, SharedResult) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.metaData = SharedResult.data;

    $scope.backToSearch = function(event) {
        $location.path('/search');
    };

});
