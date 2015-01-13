'use strict';

/**
 * Service unavailable error
 *
 * @author      spanhawk
 * @version     0.0.1
 */

var HTTP_SERVICE_UNAVAILABLE = 503;
var NAME = 'ServiceUnavailable';

/**
 * Constrcutor
 *
 * @param {String}      message       The authorization error message
 */
function ServiceUnavailable(message) {
  this.name = NAME;
  this.message = message;
  this.code = HTTP_SERVICE_UNAVAILABLE;
}

ServiceUnavailable.prototype = new Error();

/**
 * Module exports
 */
module.exports = ServiceUnavailable;

