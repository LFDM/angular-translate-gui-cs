'use strict';

angular.module('arethusaTranslateGuiApp').directive('trsl', [
  '$timeout',
  'CONFIG',
  function($timeout, CONFIG) {
    var DIRTY = 'dirty-bg-dark';
    var CLEAN = 'clean-bg-dark';

    function getEventName(main) {
      return main ? 'mainChange' : 'trslChange';
    }

    function isMain(lang) {
      return CONFIG.main === lang;
    }

    return {
      restrict: 'A',
      link: function(scope) {
        var main = isMain(scope.trsl.lang);
        var eventName = getEventName(main);

        function switchClasses(newVal) {
          scope.statusClass = newVal ? DIRTY : CLEAN;
          scope.toggleIcon = newVal ? 'check' : 'remove';
        }

        function changeStatus(bool) {
          var old = scope.trsl.dirty;
          if (main || old !== bool) {
            scope.trsl.dirty = bool;
            scope.$emit(eventName, scope.trsl);
            scope.deferredUpdate();
          }
        }

        function setClean() {
          changeStatus(false);
        }

        function setDirty() {
          changeStatus(true);
        }

        scope.toggleStatus = function() {
          if (scope.trsl.dirty) {
            setClean();
          } else {
            setDirty();
          }
        };

        var timer;
        scope.trackChange = function() {
          if (timer) $timeout.cancel(timer);
          timer = $timeout(function() {
            setClean();
            scope.deferredUpdate();
          }, 1000);
        };

        if (main) {
          scope.statusClass = '';
        } else {
          scope.$watch('trsl.dirty', switchClasses);
          scope.$on('mainDirty', setDirty);
        }
      },
      templateUrl: 'app/i18n/trsl.directive.html'
    };
  }
]);



