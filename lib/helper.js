'use strict';

/**
 * Helper library for serenity-auth module.
 * The application config object is passed by the application. This object defines all applicaiton authentication configuration
 * Currently it only caches the config object to be used in all other files
 */
var _ = require('lodash');
var errors = require('common-errors');

var helper = {};

helper.cacheConfig =function(config) {
  this._config = config;
};

helper.getConfig = function() {
  return this._config;
};

/**
 * Validates the configuration object
 * @param  {Object}   config    Configuration object to validate
 */
helper.checkConfig = function(config) {
  if(_.isUndefined(config)) {
    throw new errors.ValidationError('Configuration is not defined');
  } else if(_.isUndefined(config.auth)) {
    throw new errors.ValidationError('Configuration should have an auth object property');
  }
};

module.exports = helper;