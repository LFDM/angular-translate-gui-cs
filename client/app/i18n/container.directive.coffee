'use strict'

angular.module('arethusaTranslateGuiApp').directive 'container', [
  '$timeout',
  'containerHelper',
  ($timeout, containerHelper) ->
    restrict: 'A',
    link: (scope, element) ->
      scope.title = 'Container'

      containerHelper.nameWatch(scope)
      containerHelper.dirtyWatch(scope)
      containerHelper.addEventListeners(scope)

      update = -> scope.container.$update(-> console.log('Database updated!'))

      timer = undefined
      scope.deferredUpdate = ->
        $timeout.cancel(timer) if timer
        timer = $timeout(update, 1500)

      scope.immediateUpdate = ->
        $timeout.cancel(timer) if timer
        update()

      scope.addSubContainer = scope.subContainerFactory(scope)
      scope.addValue = scope.valueFactory(scope)

      scope.remove = ->
        scope.removeHelper scope.containers, scope.container, ->
          scope.$parent.$emit('containerRemoved', scope.container)
          scope.container.$remove()

      scope.scrollWatch(scope, scope.container._id, element)
    templateUrl: 'app/i18n/container.directive.html'
]
