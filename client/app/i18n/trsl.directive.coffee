'use strict'

angular.module('arethusaTranslateGuiApp').directive 'trsl', [
  '$timeout',
  'CONFIG',
  ($timeout, CONFIG) ->
    DIRTY = 'dirty-bg-dark'
    CLEAN = 'clean-bg-dark'

    getEventName = (main) -> if main then 'mainChange' else 'trslChange'
    isMain = (lang) -> CONFIG.main is lang

    restrict: 'A'
    link: (scope) ->
      main = isMain(scope.trsl.lang)
      eventName = getEventName(main)

      switchClasses = (newVal) ->
        res = if newVal then [DIRTY, 'check'] else [CLEAN, 'remove']
        [scope.statusClass, scope.toggleIcon] = res

      changeStatus = (bool) ->
        old = scope.trsl.dirty
        if main or old isnt bool
          scope.trsl.dirty = bool
          scope.$emit(eventName, scope.trsl)
          scope.deferredUpdate()

      setClean = -> changeStatus(false)
      setDirty = -> changeStatus(true)

      scope.toggleStatus = -> if scope.trsl.dirty then setClean() else setDirty()

      timeoutFn = ->
        setClean()
        scope.deferredUpdate()

      timer = null
      scope.trackChange = ->
        $timeout.cancel(timer) if timer
        timer = $timeout(timeoutFn, 1000)

      if main
        scope.statusClass = ''
      else
        scope.$watch('trsl.dirty', switchClasses)
        scope.$on('mainDirty', setDirty)

    templateUrl: 'app/i18n/trsl.directive.html'
]
