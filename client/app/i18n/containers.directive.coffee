'use strict'

angular.module('arethusaTranslateGuiApp').directive 'containers', [
  '$timeout',
  ($timeout) ->
   restrict: 'A',
   scope: true,
   link: (scope, element) ->
     scope.$on 'dataLoaded', ->
       # When new data is loaded the DOM will take a while to update
       # itself. Let's hide this fact by pushing the content out of the
       # viewport and show a loading message instead.
       # Once we are done, we move the DOM elements into the users sight.
       scope.rendering = true
       $timeout ->
         scope.rendering = false
       , 2000

     scope.$watch 'showIndex', (newVal) ->
       if newVal
         scope.containerClass = 'small-8 medium-8 large-10'
         scope.itemClass = 'small-12'
       else
         scope.containerClass = 'small-12'
         scope.itemClass = 'small-6'
       scope.cloak = true
       $timeout ->
         scope.cloak = false
       , 600

     easeInOutCubic = (t) -> if t<0.5 then 4*t*t*t else (t-1)*(2*t-2)*(2*t-2)+1

     autoScroll = (ev, item) ->
       element.find('#scroller').scrollTo(item, 0, 1200, easeInOutCubic)

     scope.$on('scrollToItem', autoScroll)
   templateUrl: 'app/i18n/containers.directive.html'
]

