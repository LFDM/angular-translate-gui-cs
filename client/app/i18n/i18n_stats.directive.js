'use strict';

angular.module('arethusaTranslateGuiApp').directive('i18nStats', [
  function() {
    var CLEAN = 'clean';
    var DIRTY = 'dirty';

    return {
      restrict: 'A',
      scope: {
        stats: '=i18nStats'
      },
      link: function(scope) {
        scope.$watch('stats.dirty', function(newVal) {
          scope.dirtyClass = newVal ? DIRTY : CLEAN;
        });
      },
      templateUrl: 'app/i18n/i18n_stats.directive.html'
    };
  }
]);
