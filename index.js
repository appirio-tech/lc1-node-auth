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

function getUserSafeList() {
  var safeListUsers = [];
  if (_config.auth.safeList && _config.auth.safeList.users) {
    safeListUsers = _config.auth.safeList.users;
  } else {
    safeListUsers = [
      'dayal',
      'rockabilly',
      'kbowerma',
      ' _indy',
      'appiriowes'
    ];
  }

  // If from config and this is not an array then split on comma
  if (!_.isArray(safeListUsers)) {
    safeListUsers = safeListUsers.split(',');
  }

  return safeListUsers;
}

function currentUserSafe(req) {
  return getUserSafeList().indexOf(tcUser.getSigninUser(req));
}

exports.safeList = function(req, res, next) {
  if (_config.auth.safeList && _config.auth.safeList.enabled) {
    if (!currentUserSafe(req)) {
      // Remove user and tcUser This will cause requireAuth middleware to return
      // @TODO Later we might want to log this info so we shouldn't be deleting it
      delete req.user;
      delete req.tcUser;
    }
  }
  next();
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

exports.getUserSafeList = getUserSafeList;
exports.currentUserIsSafe = currentUserSafe;