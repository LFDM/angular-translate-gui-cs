'use strict'

angular.module('arethusaTranslateGuiApp').directive 'subContainers', [
  '$compile',
  ($compile) ->
   restrict: 'A',
   link: (scope, element) ->
     template = '
       <div
         class="nested-container fade"
         ng-repeat="container in container.containers track by container._id">
           <div sub-container/>
       </div>
     '
     element.append($compile(template)(scope))
]
