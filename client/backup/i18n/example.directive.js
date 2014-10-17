'use strict';

angular.module('arethusaTranslateGuiApp').directive('example', [
  function() {
   return {
     restrict: 'A',
     scope: {
       example: '='
     },
     link: function(scope) {
       // Due to the peculiarities of the blindInput directive
       // we are using here, we need to explicitly bring a couple
       // of things into this scope.
       // Very ugly and not very good - but it will do in this case.
       scope.deferredUpdate = scope.$parent.deferredUpdate;
       scope.$watch('$parent.adminMode', function(newVal) {
         scope.adminMode = newVal;
       });
     },
     templateUrl: 'app/i18n/example.directive.html'
   };
  }
]);
