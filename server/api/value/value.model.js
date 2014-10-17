'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    translations = require('../translation/translation.model');

var ValueSchema = new Schema({
  name: String,
  comment: String,
  exampleUrl: String,
  example: String,
  dirty: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  translations: [ translations.schema ],
});

module.exports = mongoose.model('Value', ValueSchema);
