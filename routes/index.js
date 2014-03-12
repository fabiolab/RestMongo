var routesMap = require('../conf/routes.json');
var Info = require ('../app/root');
var RestHandler = require('../app/restHandler.js');
var logger = require('../logger.js');

module.exports = function(pApp, pMongoDbConnexion, pCollectionName, pPackageInfo) {

	// PUT not allowed => 405	
	pApp.put('/'+pPackageInfo.name+'/*',function (req, res, next) {
		logger.getInstance().debug('routes/index.js : Put forbidden');
		res.respond("PUT method is forbidden", 405);
	});

	// POST not allowed => 405	
	pApp.post('/'+pPackageInfo.name+'/*',function (req, res, next) {
		logger.getInstance().debug('routes/index.js : Post forbidden');
		res.respond("POST method is forbidden", 405);
	});

	// DELETE not allowed => 405	
	pApp.del('/'+pPackageInfo.name+'/*',function (req, res, next) {
		logger.getInstance().debug('routes/index.js : Delete forbidden');
		res.respond("DELETE method is forbidden", 405);
	});

	// '/' Route module
	var infoMod = new Info(pPackageInfo, routesMap);
	infoMod.mapToDisplay(pApp,'/'+pPackageInfo.name);

	// Get the collection object from the db connexion
	var collection = pMongoDbConnexion.collection(pCollectionName);
	var restHand = new RestHandler();

	// Generic treatments of routes
	logger.getInstance().debug('routes/index.js : Loop for routes');
	for(var i=0;i<routesMap.length;i++){
		logger.getInstance().debug('routes/index.js : Mapping of ' + pPackageInfo.name+routesMap[i].path);
		restHand.mapPathToQuery(pApp, '/'+pPackageInfo.name+routesMap[i].path, collection, routesMap[i].mongoQuery);
	}
	
	// Other URL returns a 400 error code	
	pApp.get('/'+pPackageInfo.name+'/*',function (req, res, next) {
		logger.getInstance().debug('routes/index.js : Unknown route');
		res.respond("No treatment mapped to this route", 400);
	});	
};
