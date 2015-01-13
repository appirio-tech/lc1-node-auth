'use strict';

/**
 * Common serenity authentication module
 *
 * @author    spanhawk
 * @version   0.0.1
 */

var jwtCheck = require('./lib/jwtCheck');
var checkPaths = null;
var tcUser = null;
var checkPerms = null;
var safeList = null;
var helper = require('./lib/helper');

/**
 * Init the module. require all dependencies and cache config
 * @param  {Object}   config    Configuration object
 */
function init(config) {
  // cache config
  helper.cacheConfig(config);
  checkPaths = require('./lib/checkPath');
  tcUser = require('./lib/tcUser');
  checkPerms = require('./lib/checkPerms');
  safeList = require('./lib/safelist');
};

/**
 * Authentication middleware
 * @param  {Object}   app       Express app instance to bind authentication to this instance
 * @param  {Object}   config    application configuration
 * @param  {Function} next      next function in middleware chain
 */
exports.auth = function(app, config, next) {
  // init module
  init(config);
  var authEnabled = false;

  if (config.auth.enabled) {
    authEnabled = config.auth.enabled;
  }

  // First check if auth is enabled
  if (authEnabled && authEnabled !== 'false') {
    // Add the jwt middleware to the paths
    checkPaths.checkPath(app,
      [jwtCheck.jwtCheck(config.get('auth0')), tcUser.tcUser, checkPerms.checkPerms, next]);

    // currently this is hard coded
    app.get('/challenges/:challengeId/register',
      [jwtCheck.jwtCheck(config.get('auth0')), tcUser.tcUser, next]);
  } else {
    // fake auth
    app.use(tcUser.mockUser);
  }
};

/**
 * Return the user currently singed in.
 * @param req the request
 */
exports.getSigninUser = function(req) {
  return tcUser.getSigninUser(req);
};

/**
 * Safelist exports
 */
exports.getUserSafeList = safeList.getUserSafeList;

exports.currentUserIsSafe = safeList.currentUserIsSafe;