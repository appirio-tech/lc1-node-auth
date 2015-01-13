'use strict';

var tcUser = require('./tcUser');
var _ = require('lodash');
var UnauthorizedError = require('../errors/UnauthorizedError');
var helper = require('./helper'),
  config = helper.getConfig();

function getPerms() {
  var perms = [];
  if (config.auth.perms) {
    perms = config.auth.perms;
  } else {
    perms = [
      'challengeApp'
    ];
  }

  // If from config and this is not an array then split on comma
  if (!_.isArray(perms)) {
    perms = perms.split(',');
  }

  return perms;
}

function currentUserPass(req) {
  var perms = getPerms();
  var user = tcUser.getSigninUser(req);

  _.forEach(perms, function(perm) {
    if (!user.perms[perm]) {
      return false;
    }
  });

  return true;
}

exports.checkPerms = function(req, res, next) {
  if (!currentUserPass(req)) {
    // handle unauthorized error in express way
    var err = new UnauthorizedError('User is not authorized');
    next(err);
  }

  next();
};

exports.getPerms = getPerms;
exports.currentUserPass = currentUserPass;