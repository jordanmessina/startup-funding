'use strict';

/**
 * @ngdoc overview
 * @name fundingApp
 * @description
 * # fundingApp
 *
 * Main module of the application.
 */
var app = angular
  .module('fundingApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
