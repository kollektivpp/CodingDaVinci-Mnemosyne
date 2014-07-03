'use strict';

angular.module('mnemosyneApp')
  .controller('MetaCtrl', function ($scope, $location, SharedResult, ResultParser) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.metaData = SharedResult.data;

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

    // Animation
    $scope.flipEventHandler = function(event) {
        var nextElements = $(this).parents('.meta-element-wrapper').next();
        nextElements.one('transitionend -webkit-transitionend', $scope.fadeInResult);
        nextElements.removeClass('turned-over');
    }

    $scope.fadeInResult = function(event) {
        var resultElement = $(this).find('.highlight-ready');
        resultElement.one('transitionend -webkit-transitionend', $scope.flipEventHandler);
        resultElement.addClass('highlighted');
    }

    setTimeout( function() {
        $('.meta-thread .meta-element-wrapper:first-child').one('transitionend -webkit-transitionend', $scope.fadeInResult);
        $('.meta-thread .meta-element-wrapper:first-child').removeClass('turned-over');
    }, 800);

    setTimeout( function() {
        $('.meta-view .meta-start').removeClass('start-position');
    }, 200);
});