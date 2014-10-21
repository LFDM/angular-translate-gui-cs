'use strict'

angular.module('arethusaTranslateGuiApp').directive 'subContainer', [
  'containerHelper',
  (containerHelper) ->
    SC_CHANGE = 'subcontainerChange'

    restrict: 'A',
    link: (scope, element) ->
      scope.title = 'Sub-Container'

      containerHelper.nameWatch(scope)
      containerHelper.dirtyWatch(scope, -> scope.$emit(SC_CHANGE))
      containerHelper.addEventListeners(scope)

      scope.addSubContainer = scope.subContainerFactory(scope)
      scope.addValue = scope.valueFactory(scope)

      scope.remove = ->
        scope.removeHelper scope.$parent.container.containers, scope.container, ->
          # We can skip this scope, as it's removed anyway!
          scope.$parent.$emit('containerRemoved', scope.container)
          scope.$parent.$emit(SC_CHANGE)
          scope.immediateUpdate()
      scope.scrollWatch(scope, scope.container._id, element)
    templateUrl: 'app/i18n/container.directive.html'
]

