'use strict';

var _ = require('lodash');
var Container = require('./container.model');

// Get list of containers
exports.index = function(req, res) {
  Container.find().sort('name').exec(function (err, containers) {
    if(err) { return handleError(res, err); }
    return res.json(200, containers);
  });
};

// Get a single container
exports.show = function(req, res) {
  Container.findById(req.params.id, function (err, container) {
    if(err) { return handleError(res, err); }
    if(!container) { return res.send(404); }
    return res.json(container);
  });
};

// Creates a new container in the DB.
exports.create = function(req, res) {
  Container.create(req.body, function(err, container) {
    if(err) { return handleError(res, err); }
    return res.json(201, container);
  });
};

// Updates an existing container in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Container.findById(req.params.id, function (err, container) {
    if (err) { return handleError(res, err); }
    if(!container) { return res.send(404); }
    var updated = _.extend(container, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, container);
    });
  });
};

// Deletes a container from the DB.
exports.destroy = function(req, res) {
  console.log(req.params);
  Container.findById(req.params.id, function (err, container) {
    if(err) { return handleError(res, err); }
    if(!container) { return res.send(404); }
    container.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

