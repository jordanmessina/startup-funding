angular.module('fundingApp')
  .directive('bootstrapContainer', function() {

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="container-fluid" ng-transclude></div>'
    }

  })
