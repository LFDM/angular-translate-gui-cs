'use strict';

angular.module('arethusaTranslateGuiApp').directive('containers', [
  '$timeout',
  function($timeout) {
   return {
     restrict: 'A',
     scope: true,
     link: function(scope, element) {
       scope.$on('dataLoaded', function() {
         // When new data is loaded the DOM will take a while to update
         // itself. Let's hide this fact by pushing the content out of the
         // viewport and show a loading message instead.
         // Once we are done, we move the DOM elements into the users sight.
         scope.rendering = true;
         $timeout(function() {
           scope.rendering = false;
         }, 2000);
       });

       scope.$watch('showIndex', function(newVal) {
         if (newVal) {
           scope.containerClass = 'small-8 medium-8 large-10';
           scope.itemClass = 'small-12';
         } else {
           scope.containerClass = 'small-12';
           scope.itemClass = 'small-6';
         }
         scope.cloak = true;
         $timeout(function() {
           scope.cloak = false;
         }, 600);
       });

       function easeInOutCubic(t) {
         return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
       }

       function autoScroll(ev, item) {
         element.find('#scroller').scrollTo(item, 0, 1200, easeInOutCubic);
       }

       scope.$on('scrollToItem', autoScroll);
     },
     templateUrl: 'app/i18n/containers.directive.html'
   };
  }
]);

