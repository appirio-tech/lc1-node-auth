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
var helper = require('./lib/helper');
var _ = require('lodash');
var _config = null;
var errors = require('common-errors');

/**
 * Init the module. require all dependencies and cache config
 * @param  {Object}   config    Configuration object
 */
function init(config) {
  helper.checkConfig(config);
  // cache config
  helper.cacheConfig(config);
  _config = config;
  checkPaths = require('./lib/checkPath');
  tcUser = require('./lib/tcUser');
  checkPerms = require('./lib/checkPerms');
}

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
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, checkPerms.checkPerms, next]);

    // currently this is hard coded
    app.get('/challenges/:challengeId/register',
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, next]);

    // Hard code file permission
    app.get('/challenges/:challengeId/files/:fileId/download',
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, next]);

    app.get('/challenges/:challengeId/files/:fileId/upload',
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, next]);

    app.get('/challenges/:challengeId/submissions/:submissionId/files/:fileId/upload',
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, next]);

    app.get('/challenges/:challengeId/submissions/:submissionId/files/:fileId/download',
      [jwtCheck.jwtCheck(config.auth0), tcUser.tcUser, next]);

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
 * Authentication handler for authenticated paths defined in configuration settings
 * @param req the request
 * @param res the response
 * @param next the next
 */
exports.requireAuth = function(req, res, next) {
  if(!req.user || !req.tcUser) {
    return next(new errors.AuthenticationRequiredError("User is not authenticated"));
  }
  next();
};

/**
 * Expose the check permissions to other modules
 */
exports.currentUserPass = function(req) {
  return checkPerms.currentUserPass(req);
};
