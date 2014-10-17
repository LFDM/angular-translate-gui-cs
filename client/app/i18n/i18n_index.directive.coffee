'use strict'

angular.module('arethusaTranslateGuiApp').directive 'i18nIndex', [
  ->
    restrict: 'A',
    scope: true,
    templateUrl: 'app/i18n/i18n_index.directive.html'
]

angular.module('arethusaTranslateGuiApp').directive 'i18nIndexCollection', [
  '$compile',
  ($compile) ->
    restrict: 'A',
    scope:
      containers: '=i18nIndexCollection'
    link: (scope, element) ->
      template = '\
        <li ng-repeat="container in containers">\
           <div i18n-index-item="container"/>\
        </li>\
      '
      element.append($compile(template)(scope))
]

angular.module('arethusaTranslateGuiApp').directive 'i18nIndexItem', [
  '$rootScope',
  ($rootScope) ->
    restrict: 'A',
    scope:
      item: '=i18nIndexItem'
    link: (scope) ->
      scope.scrollThere = ->
        $rootScope.$broadcast 'autoScrollRequest', scope.item._id

      scope.$watch 'item.dirty', (newVal) ->
        scope.statusClass = if newVal then 'dirty' else 'clean'

    templateUrl: 'app/i18n/i18n_index_item.directive.html'
]

angular.module('arethusaTranslateGuiApp').directive 'i18nIndexToggleAll', [
  '$rootScope',
  ($rootScope) ->
    restrict: 'A',
    link: (scope) ->
      setText = ->
        scope.text = if scope.toggled then 'Reduce all' else 'Expand all'

      scope.toggle = ->
        scope.toggled = !scope.toggled
        $rootScope.$emit 'toggleIndexItems', scope.toggled
        setText()

    template: '<span class="clickable underline note right" ng-click="toggle()">{{ text }}</span>'
]

angular.module('arethusaTranslateGuiApp').directive 'i18nIndexExpander', [
  '$rootScope',
  ($rootScope) ->
    setExpander = (scope) ->
      if scope.expanded then '▾' else '▸'

    restrict: 'A',
    link: (scope, element) ->
      isBottom = scope.item.translation
      scope.expanded = scope.toggled

      unless isBottom
        element.addClass('clickable')

        scope.toggle = ->
          scope.expanded = !scope.expanded
          scope.expander = setExpander(scope)

        $rootScope.$on 'toggleIndexItems', (ev, value) ->
          scope.expanded = value
          scope.expander = setExpander(scope)

      scope.expander = if isBottom then '▹' else setExpander(scope)

    template: '<span class="expander" ng-click="toggle()">{{ expander }}</span>'
]
