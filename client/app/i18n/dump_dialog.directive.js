
'use strict';

angular.module('arethusaTranslateGuiApp').directive('dumpDialog', [
  '$modal',
  '$window',
  function($modal, $window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('click', function() {
          // Modal disabled for now - readd later when we can do more flexible
          // dumps!
          //
          //$modal.open({
            //templateUrl: 'app/dump/dump.html',
            //controller: 'DumpCtrl',
            //resolve: {
              //languages: function() {
                //return scope.languages;
              //}
            //}
          //});

          // This call is a placeholder until the modal is activated again
          $window.open('api/dump', '_self');
        });
      }
    };
  }
]);



