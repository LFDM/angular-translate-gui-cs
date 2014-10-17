'use strict';

angular.module('arethusaTranslateGuiApp').service('containerHelper', [
  function() {
    var DIRTY = 'dirty-bg';
    var CLEAN = 'clean-bg';

    function stats(scope) {
      return scope.getStats(scope.container);
    }

    function isDirty(scope) {
      return stats(scope).dirty || _.find(scope.container.containers, function(el) {
        return el.dirty;
      });
    }

    function checkStatus(scope) {
      var cont = scope.container;
      if (cont.name && !isDirty(scope)) {
        scope.container.dirty = false;
      } else {
        scope.container.dirty = true;
      }
      scope.deferredUpdate();
    }

    this.nameWatch = function(scope) {
      scope.$watch('container.name', function(newVal, oldVal) {
        if (!oldVal) checkStatus(scope);
        if (!newVal) scope.container.dirty = true;
      });
    };

    this.dirtyWatch = function(scope, fn) {
      scope.$watch('container.dirty', function(newVal, oldVal) {
        scope.statusClass = newVal ? DIRTY : CLEAN;
        if (fn && newVal !== oldVal) fn();
      });
    };


    // Event Listeners

    function updateStatsAndCheck(scope) {
      return function(ev, el) {
        var stats = scope.getStats(scope.container);
        scope.updateValStats(stats, el);
        checkStatus(scope);
      };
    }

    function addToStats(scope) {
      return function(ev, el) {
        var stats = scope.getStats(scope.container);
        scope.addStats(stats, el);
        checkStatus(scope);
      };
    }

    function removeFromStats(scope) {
      return function(ev, el) {
        var stats = scope.getStats(scope.container);
        scope.removeStats(stats, el);
        checkStatus();
      };
    }

    function updateTrslStats(scope) {
      return function(ev, el) {
        var stats = scope.getStats(scope.container);
        scope.updateTrslStats(stats, el);
      };
    }

    this.addEventListeners = function(scope) {
      scope.$on('valueChange', updateStatsAndCheck(scope));
      scope.$on('valueAdded', addToStats(scope));
      scope.$on('valueRemoved', removeFromStats(scope));
      scope.$on('trslChange', updateTrslStats(scope));
      scope.$on('subcontainerChange', function() { checkStatus(scope); });
    };
  }
]);
