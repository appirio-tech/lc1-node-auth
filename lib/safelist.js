'use strict';
var helper = require('/helper'),
  config = helper.getConfig();
var tcUser = require('./tcUser');
var _ = require('lodash');

function getUserSafeList() {
  var safeListUsers = [];
  if (config.auth.safeList.users) {
    safeListUsers = config.auth.safeList.users;
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
  if (config.auth.safeList.enabled && config.auth.safeList.enabled) {
    if (!currentUserSafe(req)) {
      // Remove user and tcUser This will cause requireAuth middleware to return
      // @TODO Later we might want to log this info so we shouldn't be deleting it
      delete req.user;
      delete req.tcUser;
    }
  }
  next();
};

exports.getUserSafeList = getUserSafeList;
exports.currentUserIsSafe = currentUserSafe;