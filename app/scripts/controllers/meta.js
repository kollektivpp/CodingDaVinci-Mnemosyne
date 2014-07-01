'use strict';

angular.module('mnemosyneApp')
  .controller('MetaCtrl', function ($scope, $location, SharedResult) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.metaData = SharedResult.data;

    console.log($scope.metaData);

    if ($scope.metaData.length > 0) {
        $scope.thread1 = $scope.metaData[0];
        $scope.thread1.index = 1;
        $scope.thread2 = $scope.metaData[1];
        $scope.thread2.index = 2;
        $scope.thread3 = $scope.metaData[2];
        $scope.thread3.index = 3;
        $scope.thread4 = $scope.metaData[3];
        $scope.thread4.index = 4;
        $scope.thread5 = $scope.metaData[4];
        $scope.thread5.index = 5;
    }

    $scope.backToSearch = function(event) {
        $location.path('/search');
    };

});