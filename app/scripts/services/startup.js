'use strict';

/**
 * @ngdoc function
 * @name fundingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fundingApp
 */

angular.module('fundingApp')
  .factory('startupService', ['$log', function($log) {
    var startupService = {
      startup: new Startup(),
      investors: [], // this is an array of investors the user creates before assigning to CNs/equity rounds. It's strictly for the presentation layer.

      capTable: {
        shareholders: [],
        totalShares: 0
      }
    };

    startupService.updateCapTable = function(){
      startupService.capTable = startupService.startup.capTable();
    };

    return startupService;
  }]);
