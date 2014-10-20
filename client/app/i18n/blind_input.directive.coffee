'use strict'

angular.module('arethusaTranslateGuiApp').directive 'blindInput', [
  '$parse',
  '$timeout',
  ($parse, $timeout) ->
    restrict: 'AE'
    scope:
      model: '=ngModel',
      type: '@',
      placeholder: '@'
    link: (scope, element, attrs) ->
      parent  = scope.$parent
      ngModel = attrs.ngModel
      getter  = $parse(ngModel)
      setter  = getter.assign

      scope.$watch 'model', (newVal, oldVal) ->
        if newVal isnt oldVal
          setter(parent, scope.model)
          parent.deferredUpdate()

      scope.$watch '$parent.adminMode', (newVal) -> scope.adminMode = newVal

      shouldAutoFocus = -> scope.$parent.autoFocus && ngModel.match(/name$/)

      if shouldAutoFocus()
        # Need to $timeout, because this field is only present
        # after a ngIf evaluation.
        $timeout ->
          input = element.find('input')[0]
          input.focus()
          scope.$parent.$emit 'autoFocusTriggered'
    templateUrl: 'app/i18n/blind_input.directive.html'
]
