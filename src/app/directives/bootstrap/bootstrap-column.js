angular.module('fundingApp')
  .directive('bootstrapColumn', function() {

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function(scope, elem, attrs) {
        if (attrs.sm) elem.addClass('col-sm-' + attrs.sm);
        if (attrs.md) elem.addClass('col-md-' + attrs.md);
        if (attrs.lg) elem.addClass('col-lg-' + attrs.lg);
      }
    };

  })
