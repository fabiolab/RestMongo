var logger = require('../logger.js');

/*
 * This module is used for testing the external connections.
 */
function SmokeTest(pMongoClient) {
	"use strict";

	/*
	 * Displays the result of the external connections
	 * @param pApp The express application
	 * @param pRoute The route mapped to the test
	 * @param pMongoUri The mongoDB uri 
	 */
	this.displayTestResults = function(pApp, pRoute, pMongoUri) {
		pApp.get(pRoute, function(req, res, next) {
			pMongoClient.connect(pMongoUri, function(err, db) {
				"use strict";
				if (err) {
					res.respond("Connection failed on "+pMongoUri, 500);
					logger.getInstance().error("Connection failed on "+pMongoUri);
				}
				res.respond("Connection succeeded on "+pMongoUri, 200);
				logger.getInstance().info("Connection succeeded on "+pMongoUri);
			});
		});
	};
}

module.exports = SmokeTest;