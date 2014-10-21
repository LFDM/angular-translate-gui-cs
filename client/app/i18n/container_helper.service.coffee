'use strict'

angular.module('arethusaTranslateGuiApp').service 'containerHelper', [
  ->
    DIRTY = 'dirty-bg'
    CLEAN = 'clean-bg'

    stats = (scope) -> scope.getStats(scope.container)

    isDirty = (scope) ->
      stats(scope).dirty || _.find(scope.container.containers, (el) -> el.dirty)

    checkStatus = (scope) ->
      cont = scope.container
      scope.container.dirty = !(cont.name || isDirty(scope))
      scope.deferredUpdate()

    this.nameWatch = (scope) ->
      scope.$watch 'container.name', (newVal, oldVal) ->
        checkStatus(scope) unless oldVal
        scope.container.dirty = true unless newVal

    this.dirtyWatch = (scope, fn) ->
      scope.$watch 'container.dirty', (newVal, oldVal) ->
        scope.statusClass = if newVal then DIRTY else CLEAN
        console.log scope.statusClass
        fn() if fn && newVal isnt oldVal

    # Event Listeners

    getStats = (scope )-> scope.getStats(scope.container)

    updateStatsAndCheck = (scope) ->
      (ev, el) ->
        scope.updateValStats(getStats(scope), el)
        checkStatus(scope)

    addToStats = (scope) ->
      (ev, el) ->
        scope.addStats(getStats(scope), el)
        checkStatus(scope)

    removeFromStats = (scope) ->
      (ev, el) ->
        scope.removeStats(getStats(scope), el)
        checkStatus()

    updateTrslStats = (scope) ->
      (ev, el) ->
        stats = scope.getStats(scope.container)
        scope.updateTrslStats(stats, el)

    this.addEventListeners = (scope) ->
      scope.$on 'valueChange', updateStatsAndCheck(scope)
      scope.$on 'valueAdded', addToStats(scope)
      scope.$on 'valueRemoved', removeFromStats(scope)
      scope.$on 'trslChange', updateTrslStats(scope)
      scope.$on 'subcontainerChange', -> checkStatus(scope)

    return this
]
