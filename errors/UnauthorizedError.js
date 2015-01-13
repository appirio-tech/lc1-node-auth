'use strict';

/**
 * Unauthorized error
 *
 * @author      spanhawk
 * @version     0.0.1
 */

var HTTP_UNAUTHORIZED = 401;
var NAME = 'UnauthorizedError';

/**
 * Constrcutor
 *
 * @param {String}      message       The authorization error message
 */
function UnauthorizedError(message) {
  this.name = NAME;
  this.message = message;
  this.code = HTTP_UNAUTHORIZED;
}

UnauthorizedError.prototype = new Error();

/**
 * Module exports
 */
module.exports = UnauthorizedError;

