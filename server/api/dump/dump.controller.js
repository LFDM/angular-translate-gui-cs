'use strict';

var _ = require('lodash');
var AdmZip = require('adm-zip');
var Container = require('../container/container.model')
var objPath = require('object-path');

function addToLang(result, path, trsl, lang) {
  var langContainer = result[lang];
  if (!langContainer) langContainer = result[lang] = {};
  objPath.set(langContainer, path, trsl);
}

function addTranslations(result, path, val) {
  val.translations.forEach(function(trsl) {
    addToLang(result, path, trsl.translation, trsl.lang)
  });
}

function addValues(result, values, path) {
  values.forEach(function(value) {
    path.push(value.name);
    addTranslations(result, path.join('.'), value);
    path.pop();
  });
}

function addContainers(result, containers, path) {
  containers.forEach(function(container) {
    path.push(container.name);
    addValues(result, container.values, path);
    addContainers(result, container.containers, path);
    path.pop();
  });
}

function generateDump(callback) {
  Container.find(function(err, containers) {
    var result = {};

    // Take out the unnamespaced container
    var i = _.findIndex(containers, function(el) {
      return el.name === 'withoutNamespace';
    });
    var woNamespace = containers[i];
    containers.splice(i, 1);

    var path = [];
    addValues(result, woNamespace.values, path);
    addContainers(result, containers, path);

    callback(result)
  });
}

// Get list of dumps
exports.index = function(req, res) {
  var zip = new AdmZip();
  var zipname = "translations.zip";

  generateDump(function(result) {
    for (var lang in result) {
      var content = result[lang];
      var filename = lang + '.json';
      var json = new Buffer(JSON.stringify(content, null, "  "));
      zip.addFile(filename, json);
    }

    var buffer = zip.toBuffer();
    res.set('Content-Type', 'application/zip; charset=utf-8');
    res.setHeader('Content-disposition', 'attachment; filename=' + zipname);
    res.send(buffer);
    return res.json(200);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
