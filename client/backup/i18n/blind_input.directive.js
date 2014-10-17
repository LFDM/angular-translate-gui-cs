'use strict';

angular.module('arethusaTranslateGuiApp').directive('blindInput', [
  '$parse',
  '$timeout',
  function($parse, $timeout) {
    return {
      restrict: 'AE',
      scope: {
        model: '=ngModel',
        type: '@',
        placeholder: '@'
      },
      link: function(scope, element, attrs) {
        var parent  = scope.$parent,
            ngModel = attrs.ngModel,
            getter  = $parse(ngModel),
            setter  = getter.assign;

        scope.$watch('model', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            setter(parent, scope.model);
            parent.deferredUpdate();
          }
        });

        scope.$watch('$parent.adminMode', function(newVal) {
          scope.adminMode = newVal;
        });

        function shouldAutoFocus() {
          return scope.$parent.autoFocus && ngModel.match(/name$/);
        }

        if (shouldAutoFocus()) {
          // Need to $timeout, because this field is only present
          // after a ngIf evaluation.
          $timeout(function() {
            var input = element.find('input')[0];
            input.focus();
            scope.$parent.$emit('autoFocusTriggered');
          });
        }
      },
      templateUrl: 'app/i18n/blind_input.directive.html'
    };
  }
]);
