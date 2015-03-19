angular.module('fundingApp')
  .directive('sfFinalEquity', ['Startup', 'Shareholders', function() {

    return {
      restrict: 'EA',
      templateUrl: 'templates/directives/sf-final-equity.html',
    };

  }])
