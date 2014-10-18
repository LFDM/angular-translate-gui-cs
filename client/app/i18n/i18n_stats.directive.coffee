'use strict'

angular.module('arethusaTranslateGuiApp').directive 'i18nStats', [
  ->
    CLEAN = 'clean'
    DIRTY = 'dirty'

    restrict: 'A',
    scope:
      stats: '=i18nStats'
    link: (scope) ->
      scope.$watch 'stats.dirty', (newVal) ->
        scope.dirtyClass = if newVal then DIRTY else CLEAN
    templateUrl: 'app/i18n/i18n_stats.directive.html'
]
