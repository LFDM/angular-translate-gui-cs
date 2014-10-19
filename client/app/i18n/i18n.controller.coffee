'use strict'

angular.module('arethusaTranslateGuiApp').controller 'I18nCtrl', [
  '$scope',
  '$resource',
  '$modal',
  'CONFIG',
  ($scope, $resource, $modal, CONFIG) ->
    $scope.showIndex = true
    $scope.maxItemsShown = 0
    $scope.languages = CONFIG.languages

    # We cannot store stats directly with resources, as we don't
    # store them in the DB. We therefore populate a dedicated
    # stats store ourselves.
    $scope.stats = {}

    Container = $resource '/api/containers/:id', { id: '@_id' },
      update:
        method: 'PUT'

    Uid = $resource('/api/uid')

    class LangStats
      constructor: ->
        for lang in $scope.languages
          @[lang] = 0

    class Stats
      constructor: ->
        @total = 0
        @dirty = 0
        @lang = new LangStats()

    addValStats = (dirty, elements) ->
      for el in elements
        el.total += 1
        el.dirty += 1 if dirty

    addTrslStats = (lang, dirty, elements) ->
      if dirty
        for el in elements
          el.lang[lang] += 1

    addMissingTranslations = (trsls) ->
      langs = $scope.languages
      if langs.length isnt trsls.length
        missing = angular.copy(langs)
        for trsl in trsls
          i = missing.indexOf(trsl.lang)
          missing.splice(i, 1)
        for missingLang in missing
          trsls.push(new Translation(missingLang))

    parseTranslations = (translations, elements) ->
      addMissingTranslations(translations)
      for trsl in translations
        addTrslStats(trsl.lang, trsl.dirt, elements)

    parseValues = (values, elements) ->
      for val in values
        addValStats(val.dirty, elements)
        parseTranslations(val.translations, elements)

    addToStatsStore = (el) ->
      stats = new Stats()
      $scope.stats[el._id] = stats

    $scope.substractFromTotal = (parent, stats) ->
      parent.total -= stats.total
      parent.dirty -= stats.dirty
      [parLang, sttLang] = [parent.lang, stats.lang]
      for lang in parLang
        parLang[lang] -= sttLang[lang]

    parseContainers = (containers, elements) ->
      for container in containers
        stats = addToStatsStore(container)
        elements.push(stats)
        parseValues(container.values, elements)
        parseContainers(container.containers, elements)
        elements.pop()

    parseData = (containers) ->
      total = new Stats()
      elements = [total]
      parseContainers(containers, elements)
      total

    setup = (containers) -> $scope.stats.total = parseData(containers)

    $scope.getStats = (el) -> $scope.stats[el._id] || {}

    updateStats = (stats, value, count) ->
      stats.total += count
      if value.dirty
        stats.dirty += count
        for trsl in value.translations
          stats.lang[trsl.lang] += count if trsl.dirty

    $scope.addStats    = (stats, value) -> updateStats(stats, value, 1)
    $scope.removeStats = (stats, value) -> updateStats(stats, value, -1)

    $scope.updateValStats = (stats, trsl) ->
      counter = if trsl.dirty then 1 else -1
      stats.dirty += counter

    $scope.updateTrslStats = (stats, trsl) ->
      counter = if trsl.dirty then 1 else -1
      stats.lang[trsl.lang] += counter

    defaultContainerParams = ->
      dirty: true
      createdAt: new Date().toJSON

    $scope.newContainer = (params) ->
      params = angular.extend(defaultContainerParams, params)
      new Container(params)

    $scope.adminMode = false
    $scope.$watch 'adminMode', (newVal) ->
      $scope.modeText = if newVal then 'Admin Mode' else 'Translator Mode'

    $scope.toggleMode = -> $scope.adminMode = !$scope.adminMode

    $scope.addContainer = ->
      cont = $scope.newContainer()
      cont.$save ->
        addToStatsStore(cont)
        $scope.autoFocus = true
        $scope.containers.unshift(cont)

    $scope.subContainerFactory = (childScope) ->
      ->
        Uid.get (res) ->
          subContainer = $scope.newContainer
            _id: res.uid
            values: []
            containers: []
        addToStatsStore(subContainer)
        childScope.container.containers.unshift(subContainer)
        childScope.immediateUpdate()
        childScope.$emit('subContainerChange')
        $scope.autoFocus = true

    $scope.$on 'autoFocusTriggered', -> $scope.autoFocus = false

    class Value
      constructor: (trsls, id) ->
        @_id = id
        @dirty = true
        @translations = trsls
        @createdAt = new Date().toJSON()

    class Translation
      constructor: (lang) ->
        @lang = lang
        @dirty = CONFIG.main isnt lang

    $scope.newTranslation = (lang) -> new Translation(lang)

    $scope.valueFactory = (childScope) ->
      ->
        Uid.get (res) ->
          cont = childScope.container
          trsls = (new Translation(lang) for lang in $scope.languages)
          value = new Value(trsls, res.uid)

          cont.values.unshift(value)
          cont.dirty = true
          $scope.autoFocus = true
          childScope.$emit('valueAdded', value)
          childScope.immediateUpdate()


    modalArgs =
      templateUrl: 'app/i18n/removal_dialog.html'
      windowClass: 'removal-modal'

    removalConfirmed = ->
      $modal.open(modalArgs).result

    $scope.removeHelper = (containers, container, fn) ->
      if result
        i = container.indexOf(container)
        containers.splice(i, 1)
        fn()

    $scope.infiniteScroll = -> $scope.maxItemsShown += 5
    $scope.resetMaxItems = -> scope.maxItemsShown = 4 if $scope.maxItemsShows > 5

    removeFromStatsStore = (ev, el) ->
      stats = $scope.stats[el._id]
      delete $scope.stats[el._id]
      $scope.substractFromTotal($scope.stats.total, stats)

    updateVal = (ev, val) -> $scope.updateValStats($scope.stats.total, val)
    updateTrsl = (ev, el) -> $scope.updateTrslStats($scope.stats.total, el)

    addToStats = (ev, el) -> $scope.addStats($scope.stats.total, el)
    removeFromStats = (ev, el) -> $scope.removeStats($scope.stats.total, el)

    $scope.$on('containerRemoved', removeFromStatsStore)
    $scope.$on('valueChange', updateVal)
    $scope.$on('trslChange', updateTrsl)
    $scope.$on('valueAdded', addToStats)
    $scope.$on('valueRemoved', removeFromStats)

    $scope.scrollWatch = (scope, ownId, element) ->
      scope.$on 'autoScrollRequest', (ev, id) ->
        scope.$emit('scrollToItem', element) if id is ownId

    Container.query (res) ->
      $scope.containers = res
      $scope.maxItemsShown = $scope.containers.length if $scope.showIndex
      setup(res)
      $scope.$broadcast('dataLoaded')
]

