'use strict';

var jwt = require('express-jwt');
var errors = require('common-errors');

exports.jwtCheck = function(options) {
  if (!options.client) {
    throw new errors.ValidationError('Auth0 Client not configured. Set `TC_AUTH0_CLIENT` as an environment variable.');
  }

  if (!options.secret) {
    throw new errors.ValidationError('Auth0 Secret not configured. Set `TC_AUTH0_SECRET` as an environment variable.');
  }

  return jwt({
    secret: new Buffer(options.secret, 'base64'),
    audience: options.client
  });
};
