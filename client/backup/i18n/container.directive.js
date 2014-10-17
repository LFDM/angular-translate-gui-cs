'use strict';

angular.module('arethusaTranslateGuiApp').directive('container', [
  '$timeout',
  'containerHelper',
  function($timeout, containerHelper) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.title = 'Container';

        function update() {
          scope.container.$update(function() {
            console.log('Database updated!');
          });
        }

        containerHelper.nameWatch(scope);
        containerHelper.dirtyWatch(scope);
        containerHelper.addEventListeners(scope);

        var timer;
        scope.deferredUpdate = function() {
          if (timer) $timeout.cancel(timer);
          timer = $timeout(update, 1500);
        };

        scope.immediateUpdate = function() {
          if (timer) $timeout.cancel(timer);
          update();
        };

        scope.addSubContainer = scope.subContainerFactory(scope);
        scope.addValue = scope.valueFactory(scope);

        scope.remove = function() {
          scope.removeHelper(scope.containers, scope.container, function() {
            scope.$parent.$emit('containerRemoved', scope.container);
            scope.container.$remove();
          });
        };

        scope.scrollWatch(scope, scope.container._id, element);
      },
      templateUrl: 'app/i18n/container.directive.html'
    };
  }
]);
