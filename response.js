var http = require('http');
var logger = require('./logger.js');

// Defining a new method on http.ServerResponse objects
http.ServerResponse.prototype.respond = function(content, status) {
	if ('undefined' == typeof status) { // only one parameter found
		if ('number' == typeof content || !isNaN(parseInt(content))) { // usage
																		// "respond(status)"
			logger.getInstance().debug('Response.js : Status not defined - Content used for status');
			status = parseInt(content);
			content = undefined;
		} else { // usage "respond(content)"
			logger.getInstance().debug('Response.js : Ok - 200 returned');
			status = 200;
		}
	}
	if (status >= 300) { // error
		logger.getInstance().debug('Response.js : Code error '+status);
		content = {
			"code" : status,
			"status" : http.STATUS_CODES[status],
			"message" : content && content.toString() || null
		};
		logger.getInstance().debug('Response.js : Message ' + content.message);
	}
	if ('object' != typeof content) { // wrap content if necessary
		content = {
			"result" : content
		};
	}
//
//	this.contentType('application/json');

	// respond with JSON data
	this.send(content, status);
};