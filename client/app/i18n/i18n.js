'use strict';

angular.module('arethusaTranslateGuiApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/i18n/i18n.html',
        controller: 'I18nCtrl'
      });
  });

