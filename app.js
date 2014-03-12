/**
 * restMongEs gets query responses from simple routes 
 * Gets its data from both mongodb and ES server 
 */

require('./response');

// Expressjs include
var express = require('express');

// Express Application declaration
var app = express();

// Conf loading
var conf = require('./conf/conf.json');
var packageInfo = require('./package.json');

// Logger
var logger = require('./logger.js');

// Routing module
var routes = require('./routes');

// Set the Mongo Client
var mongoClient = require('mongodb').MongoClient;
var mongoUri = 'mongodb://' + conf.mongo.user + ':' + conf.mongo.password + '@' + conf.mongo.server + '/' + conf.mongo.base;

//SomkeTest module loading
var SmokeTest = require ('./app/smokeTest');

// '/smokeTest' Route for smokeTest
// This route has to be defined here, before the connection to the mongoDB, since
// it tests it :)
var smokeTestMod = new SmokeTest(mongoClient);
smokeTestMod.displayTestResults(app,'/'+packageInfo.name+'/smokeTest', mongoUri);

// Connexion to Mongo
mongoClient.connect(mongoUri, function(err, db) {
	"use strict";

	if (err) {
		logger.getInstance().error('Connection failed on ' + mongoUri);
		throw err;
	}
	logger.getInstance().info('Connection succeeded on ' + mongoUri);

	// Application routes
	routes(app, db, conf.mongo.collection, packageInfo);
});

// Disable Express header
app.disable('x-powered-by');

// Listening port defined in conf file
app.listen(conf.port);

