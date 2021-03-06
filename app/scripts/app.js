'use strict';

angular
  .module('mnemosyneApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/meta', {
        templateUrl: 'views/meta.html',
        controller: 'MetaCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
