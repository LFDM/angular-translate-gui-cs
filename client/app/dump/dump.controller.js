'use strict';

angular.module('arethusaTranslateGuiApp').controller('DumpCtrl', [
  '$scope',
  'languages',
  function($scope, languages) {
    $scope.languages = languages;

    $scope.langsToBuild = _.inject(languages, function(res, lang) {
      res[lang] = true;
      return res;
    }, {});
  }
]);

