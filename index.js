'use strict';

/**
 * Common serenity authentication module
 *
 * @author    spanhawk
 * @version   0.0.1
 */

var jwtCheck = require('./lib/jwtCheck');
var checkPaths = require('./lib/checkPath');
var tcUser = require('./lib/tcUser');
var checkPerms = require('./lib/checkPerms');
var safeList = require('./lib/safelist');
var helper = require('./lib/helper');

/**
 * Authentication middleware
 * @param  {Object}   app       Express app instance to bind authentication to this instance
 * @param  {Object}   config    application configuration
 * @param  {Function} next      next function in middleware chain
 */
exports.auth = function(app, config, next) {
  // cache config
  helper.cacheConfig(config);
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