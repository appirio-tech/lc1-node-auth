'use strict';

/**
 * Helper library for serenity-auth module.
 * The application config object is passed by the application. This object defines all applicaiton authentication configuration
 * Currently it only caches the config object to be used in all other files
 */

var helper = {};

helper.cacheConfig =function(config) {
  this._config = config;
};

helper.getConfig = function() {
  return this._config;
};

module.exports = helper;