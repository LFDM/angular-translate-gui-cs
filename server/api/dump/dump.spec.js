'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment/test');
var mongoose = require('mongoose');
var Container = require('../container/container.model');

describe('GET /api/dump', function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.db, done);

  });

  afterEach(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

  it('should respond with zip file', function(done) {
    var value = {
      name: "value name",
      comment: "value comment",
      exampleUrl: "",
      example: "",
      dirty: true,
      translations: [
        {
          translation: "foo",
          lang: "en",
        },
        {
          translation: "bar",
          lang: "de",
        }
      ],
    };
    var container = {
      name: "withoutNamespace",
      dirty: true,
      comment: "my comment",
      values: [value]
    };

    Container.create(container, function (err, createdContainer) {
      should.not.exist(err);
    });
    container.name = "my container";
    Container.create(container, function (err, createdContainer) {
      should.not.exist(err);
    });

    request(app)
    .get('/api/dump')
    .expect(200)
    .expect('Content-Type', /zip/)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });
});
