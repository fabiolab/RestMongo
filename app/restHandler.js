/*
 * Handler of the Rest response
 * Send data to the client
 */
var logger = require('../logger.js');

var MongoSearch = require('./mongosearch');
var conf = require('../conf/conf.json');

function RestHandler(pCollection) {

	// DAO layer for MongoDB
	var mongosearch = new MongoSearch();
	
	var sendResponse = function(pErr, pData, pResult, pSuccessCode) {
		if (pErr) {
			pResult.respond(new Error('Technical error while processing mongo query' + pErr), 500);
			logger.getInstance().error('Technical error while processing mongo query' + pErr);
		}
		if (pData == null || pData.length <= 0) {
			pResult.respond(new Error('No data'), 404);
			//logger.getInstance().warn(pReq.route.path + ' : no data found ');
		} else {
			logger.getInstance().debug('restHandler.js : responding '+ pSuccessCode);
			pResult.respond(pData, pSuccessCode);
		}
	};

	/*
	 * Creates the association between a route and a mongo query 
	 * @param pApp The Express app that supports the mapping 
	 * @param pPath The route mapped to the mongo query 
	 * @param pQuery The mongo query as : 
	 * { 
	 * 	  "method":"find",
	 * 	  "returnAList":true,
	 *    "query": { 
	 *  	  "criteria": {},
	 *  	  "projection":{ 
	 *  		  "_id":0 
	 *  	  }
	 *    }
	 * }
	 */
	this.mapPathToQuery = function(pApp, pPath, pCollection, pQuery) {

		logger.getInstance().debug('restHandler.js : Mapping query '+pQuery+' to '+pPath);

		// Replace args "@arg@" by req.params.arg so as to let evaluation
		// possible. This operation requires the json object to be transform
		// to a string
		//
		// var queryObj = req.app.get(req.route.path).query;
		var queryObj = pQuery.query;
		var query = JSON.stringify(queryObj.criteria);
		query = query.replace('"@', "req.params.");
		query = query.replace('@"', "");

		pApp.get(pPath, function(req, res, next) {
			logger.getInstance().debug('restHandler.js : setting contentType');

			res.contentType('application/json');
			
			logger.getInstance().debug('restHandler.js : contentType set ' + res.get('Content-Type'));
		
			var start = 0;
			var limit = 10;
			var successCode = 200;

			if (req.query.start) {
				start = req.query.start;
				// if "start" set, return 206 to mention "partial content"
				successCode = 206;
				logger.getInstance().debug('restHandler.js : start - sucess code set to '+ successCode);
			}
			if (req.query.limit) {
				// cast to int
				limit = parseInt(req.query.limit);
				// if "limit" set, return 206 to mention "partial content"
				successCode = 206;
				logger.getInstance().debug('restHandler.js : limit - sucess code set to '+ successCode);
			}

			// Find methods of the defined queries
			if (pQuery.method === 'find') {
				logger.getInstance().debug('restHandler.js : query mongo find');
				mongosearch.mongoFind(pCollection, eval('(' + query + ')'), queryObj.projection, start,
						limit, function(err, data){
							sendResponse(err, data, res, successCode)
						});
				logger.getInstance().debug('restHandler.js : mongo find called !');
				return;
			}

			// FindOne methods of the defined queries
			if (pQuery.method === 'findOne') {
				logger.getInstance().debug('restHandler.js : query mongo findOne');
				
				mongosearch.mongoFindOne(pCollection, eval('(' + query + ')'), queryObj.projection, function(err, data) {
					sendResponse(err, data, res, successCode);
				});
				logger.getInstance().debug('restHandler.js : mongo findOne called !');
				return;
			}

			// Distinct methods of the defined queries
			if (pQuery.method === 'distinct') {
				logger.getInstance().debug('restHandler.js : query mongo distinct');
								
				mongosearch.mongoDistinct(pCollection, queryObj.field, queryObj.criteria, function(err, data){
					sendResponse(err, data, res, successCode);
				});
				logger.getInstance().debug('restHandler.js : mongo distinct called !');
				return;
			}
		});
	};	
	
}

module.exports = RestHandler;