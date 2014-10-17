'use strict';

angular.module('arethusaTranslateGuiApp').controller('I18nCtrl', [
  '$scope',
  '$resource',
  '$modal',
  'CONFIG',
  function($scope, $resource, $modal, CONFIG) {
    $scope.showIndex = true;
    $scope.maxItemsShown = 0;
    $scope.languages = CONFIG.languages;

    // We cannot store stats directly with resources, as we don't
    // store them in the DB. We therefore populate a dedicated
    // stats store ourselves.
    $scope.stats = {};

    var Container = $resource('api/containers/:id', { id: '@_id' }, {
      update: { method: 'PUT'}
    });

    var Uid = $resource('/api/uid');

    function LangStats() {
      for (var i = $scope.languages.length - 1; i >= 0; i--) {
        var lang = $scope.languages[i];
        this[lang] = 0;
      }
    }

    function Stats() {
      this.total = 0;
      this.dirty = 0;
      this.lang = new LangStats();
    }

    function addValStats(dirty, elements) {
      for (var i = elements.length - 1; i >= 0; i--) {
        var el = elements[i];
        el.total += 1;
        if (dirty) el.dirty += 1;
      }
    }

    function addTrslStats(lang, dirty, elements) {
      if (dirty) {
        for (var i = elements.length - 1; i >= 0; i--){
          elements[i].lang[lang] += 1;
        }
      }
    }

    function addMissingTranslations(trsls) {
      var langs = $scope.languages;
      if (langs.length !== trsls.length) {
        var missing = angular.copy(langs);
        for (var i = trsls.length - 1; i >= 0; i--) {
          var idx = missing.indexOf(trsls[i].lang);
          missing.splice(idx, 1);
        }
        for (var id = missing.length - 1; id >= 0; id--) {
          trsls.push(new Translation(missing[id]));
        }
      }
    }

    function parseTranslations(translations, elements) {
      addMissingTranslations(translations);
      for (var i = translations.length - 1; i >= 0; i--) {
        var trsl = translations[i];
        addTrslStats(trsl.lang, trsl.dirty, elements);
      }
    }

    function parseValues(values, elements) {
      for (var i = values.length - 1; i >= 0; i--){
        var val = values[i];
        addValStats(val.dirty, elements);
        parseTranslations(val.translations, elements);
      }
    }

    function addToStatsStore(el) {
      var stats = new Stats();
      $scope.stats[el._id] = stats;
      return stats;
    }

    $scope.substractFromTotal = function(parent, stats) {
      parent.total -= stats.total;
      parent.dirty -= stats.dirty;
      var parLang = parent.lang;
      var sttLang = stats.lang;
      for (var lang in parLang) {
        parLang[lang] -= sttLang[lang];
      }
    };

    function parseContainers(containers, elements) {
      for (var i = containers.length - 1; i >= 0; i--){
        var container = containers[i];
        var stats = addToStatsStore(container);
        elements.push(stats);
        parseValues(container.values, elements);
        parseContainers(container.containers, elements);
        elements.pop();
      }
    }

    function parseData(containers) {
      var total = new Stats();
      var elements = [ total ];
      parseContainers(containers, elements);
      return total;
    }

    function setup(containers) {
      $scope.stats.total = parseData(containers);
    }

    $scope.getStats = function(el) {
      return $scope.stats[el._id] || {};
    };

    function updateStats(stats, value, count) {
      stats.total += count;
      if (value.dirty) {
        stats.dirty += count;
        for (var i = value.translations.length - 1; i >= 0; i--) {
          var trsl = value.translations[i];
          if (trsl.dirty) stats.lang[trsl.lang] += count;
        }
      }
    }

    $scope.addStats = function(stats, value) {
      updateStats(stats, value, 1);
    };

    $scope.removeStats = function(stats, value) {
      updateStats(stats, value, -1);
    };

    $scope.updateValStats = function(stats, val) {
      var counter = val.dirty ? 1 : -1;
      stats.dirty += counter;
    };

    $scope.updateTrslStats = function(stats, trsl) {
      var counter = trsl.dirty ? 1 : -1;
      stats.lang[trsl.lang] += counter;
    };

    Container.query(function(res) {
      $scope.containers = res;
      if ($scope.showIndex) {
        $scope.maxItemsShown = $scope.containers.length;
      }
      setup(res);
      $scope.$broadcast('dataLoaded');
    });

    $scope.newContainer = function(params) {
      params = angular.extend({
        dirty: true,
        createdAt: new Date().toJSON()
      }, params);
      return new Container(params);
    };

    $scope.adminMode = false;
    $scope.$watch('adminMode', function(newVal) {
      $scope.modeText = newVal ? 'Admin Mode' : 'Translator Mode';
    });

    $scope.toggleMode = function() {
      $scope.adminMode = !$scope.adminMode;
    };

    $scope.addContainer = function() {
      var cont = $scope.newContainer();
      cont.$save(function() {
        addToStatsStore(cont);
        $scope.autoFocus = true;
        $scope.containers.unshift(cont);
      });
    };

    $scope.subContainerFactory = function(childScope) {
      return function() {
        Uid.get(function(res) {
          var subContainer = $scope.newContainer({
            _id: res.uid,
            values: [],
            containers: []
          });
          addToStatsStore(subContainer);
          childScope.container.containers.unshift(subContainer);
          childScope.immediateUpdate();
          childScope.$emit('subcontainerChange');
          $scope.autoFocus = true;
        });
      };
    };

    $scope.$on('autoFocusTriggered', function() {
      $scope.autoFocus = false;
    });

    function Value(trsls, id) {
      this._id = id;
      this.dirty = true;
      this.translations = trsls;
      this.createdAt = new Date().toJSON();
    }

    function Translation(lang) {
      this.lang = lang;
      this.dirty = CONFIG.main !== lang;
    }

    $scope.newTranslation = function(lang) {
      return new Translation(lang);
    };

    $scope.valueFactory = function(childScope) {
      return function() {
        Uid.get(function(res) {
          var cont = childScope.container;
          var trsls = _.map($scope.languages, function(lang) {
            return new Translation(lang);
          });
          var value = new Value(trsls, res.uid);

          cont.values.unshift(value);

          cont.dirty = true;
          $scope.autoFocus = true;
          childScope.$emit('valueAdded', value);
          childScope.immediateUpdate();
        });
      };
    };

    function removalConfirmed() {
      return $modal.open({
        templateUrl: 'app/i18n/removal_dialog.html',
        windowClass: 'removal-modal'
      }).result;
    }

    $scope.removeHelper = function(containers, container, fn) {
      removalConfirmed().then(function(result) {
        if (result) {
          var i = containers.indexOf(container);
          containers.splice(i, 1);
          fn();
        }
      });
    };

    $scope.infiniteScroll = function() {
      $scope.maxItemsShown += 5;
    };
    $scope.resetMaxItems = function() {
      if ($scope.maxItemsShown > 5) {
        $scope.maxItemsShown = 4;
      }
    };

    function removeFromStatsStore(ev, el) {
      var stats = $scope.stats[el._id];
      delete $scope.stats[el._id];
      $scope.substractFromTotal($scope.stats.total, stats);
    }

    function updateVal(ev, val) {
      $scope.updateValStats($scope.stats.total, val);
    }

    function updateTrsl(ev, el) {
      $scope.updateTrslStats($scope.stats.total, el);
    }

    function addToStats(ev, el) {
      $scope.addStats($scope.stats.total, el);
    }

    function removeFromStats(ev, el) {
      $scope.removeStats($scope.stats.total, el);
    }

    $scope.$on('containerRemoved', removeFromStatsStore);
    $scope.$on('valueChange', updateVal);
    $scope.$on('trslChange', updateTrsl);
    $scope.$on('valueAdded', addToStats);
    $scope.$on('valueRemoved', removeFromStats);

    // This should really live in a service...
    $scope.scrollWatch = function(scope, ownId, element) {
      scope.$on('autoScrollRequest', function(ev, id) {
        if (id === ownId) {
          scope.$emit('scrollToItem', element);
        }
      });
    };
  }
]);
