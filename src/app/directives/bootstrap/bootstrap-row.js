angular.module('fundingApp')
  .directive('bootstrapRow', function() {

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="row" ng-transclude></div>'
    }

  })
