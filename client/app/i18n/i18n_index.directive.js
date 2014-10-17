'use strict';

angular.module('arethusaTranslateGuiApp').directive('i18nIndex', [
  function() {
   return {
     restrict: 'A',
     scope: true,
     templateUrl: 'app/i18n/i18n_index.directive.html'
   };
  }
]);

angular.module('arethusaTranslateGuiApp').directive('i18nIndexCollection', [
  '$compile',
  function($compile) {
   return {
     restrict: 'A',
     scope: {
       containers: '=i18nIndexCollection'
     },
     link: function(scope, element) {
       var template = '\
         <li ng-repeat="container in containers">\
            <div i18n-index-item="container"/>\
         </li>\
       ';
       element.append($compile(template)(scope));
     }
   };
  }
]);

angular.module('arethusaTranslateGuiApp').directive('i18nIndexItem', [
  '$rootScope',
  function($rootScope) {
   return {
     restrict: 'A',
     scope: {
       item: '=i18nIndexItem'
     },
     link: function(scope) {
       scope.scrollThere = function() {
         $rootScope.$broadcast('autoScrollRequest', scope.item._id);
       };

       scope.$watch('item.dirty', function(newVal) {
         scope.statusClass = newVal ? 'dirty' : 'clean';
       });
     },
     templateUrl: 'app/i18n/i18n_index_item.directive.html'
   };
  }
]);

angular.module('arethusaTranslateGuiApp').directive('i18nIndexToggleAll', [
  '$rootScope',
  function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope) {
        function setText() {
          scope.text = scope.toggled ? 'Reduce all' : 'Expand all';
        }

        scope.toggle = function() {
          scope.toggled = !scope.toggled;
          $rootScope.$emit('toggleIndexItems', scope.toggled);
          setText();
        };

        setText();
      },
      template: '<span class="clickable underline note right" ng-click="toggle()">{{ text }}</span>'
    };
  }
]);

angular.module('arethusaTranslateGuiApp').directive('i18nIndexExpander', [
  '$rootScope',
  function($rootScope) {
    function setExpander(scope) {
      return scope.expanded ? '▾' : '▸';
    }

    return {
      restrict: 'A',
      link: function(scope, element) {
        // If it has translations, it's a Value - and can therefore not have
        // any more sub-levels.
        var isBottom = scope.item.translations;

        scope.expanded = scope.toggled;

        if (!isBottom) {
          element.addClass('clickable');

          scope.toggle = function() {
            scope.expanded = !scope.expanded;
            scope.expander = setExpander(scope);
          };

          $rootScope.$on('toggleIndexItems', function(ev, value) {
            scope.expanded = value;
            scope.expander = setExpander(scope);
          });
        }

        scope.expander = isBottom ? '▹' : setExpander(scope);

      },
      template: '<span class="expander" ng-click="toggle()">{{ expander }}</span>'
    };
  }
]);
