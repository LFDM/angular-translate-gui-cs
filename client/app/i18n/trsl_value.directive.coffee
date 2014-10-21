'use strict'

angular.module('arethusaTranslateGuiApp').directive 'trslValue', [
  'CONFIG',
  (CONFIG) ->
    DIRTY = 'dirty-bg'
    CLEAN = 'clean-bg'
    TRSL_CHANGE = 'trslChange'
    VALUE_CHANGE = 'valueChange'
    VALUE_REMOVED = 'valueRemoved'

    restrict: 'A',
    link: (scope, element) ->
      switchClassAndNotify = (newVal, oldVal) ->
        scope.statusClass = if newVal then DIRTY else CLEAN
        scope.$emit(VALUE_CHANGE, scope.value) if newVal isnt oldVal

      isClean = ->
        if scope.value.name
          container = scope.value.translations
          clean = true
          for cont in container
            if cont.dirty
              clean = false; break
          clean

      checkDirtyness = -> scope.value.dirty = !isClean()

      changeAllStatus = (bool) ->
        trsls = scope.value.translations
        for trsl in trsls
          unless trsl.lang is CONFIG.main or trsl.dirty is bool
            trsl.dirty = bool
            scope.$emit(TRSL_CHANGE, trsl)

      scope.$watch('value.dirty', switchClassAndNotify)

      scope.$watch 'value.name', (newVal, oldVal) ->
        checkDirtyness() unless oldVal
        scope.value.dirty = true unless newVal

      scope.$on 'mainChange', ->
        scope.value.dirty = true
        scope.$broadcast('mainDirty')
        scope.deferredUpdate()

      scope.$on(TRSL_CHANGE, checkDirtyness)

      scope.setDirty = -> changeAllStatus(true)
      scope.setClean = -> changeAllStatus(false)

      scope.remove = ->
        scope.removeHelper scope.container.values, scope.value, ->
          scope.$emit(VALUE_REMOVED, scope.value)
          scope.immediateUpdate()

      scope.scrollWatch(scope, scope.value._id, element)
    templateUrl: 'app/i18n/trsl_value.directive.html'
]
