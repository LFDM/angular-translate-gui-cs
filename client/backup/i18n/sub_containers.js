'use strict';

angular.module('arethusaTranslateGuiApp').directive('subContainers', [
  '$compile',
  function($compile) {
   return {
     restrict: 'A',
     link: function(scope, element) {
       var template = '\
         <div\
           class="nested-container fade"\
           ng-repeat="container in container.containers track by container._id">\
             <div sub-container/>\
         </div>\
       ';
       element.append($compile(template)(scope));
     }
   };
  }
]);
