var logger = require('../logger.js');

function Info(pPackageInfo,pRouteMap) {
	"use strict";

	var os = require("os");
	var changelogjson = require('../changelog.json');
	var conf = require('../conf/conf.json');
	
	this.mapToDisplay = function(pApp,pRoute){
		pApp.get(pRoute, function(req,res, next) {
			var display = new Object();		
			display.name = pPackageInfo.name;
			display.version = pPackageInfo.version;
			display.method = new Array(); //'Methods : \n';
			for(var i=0;i<pRouteMap.length;i++){
				display.method[i] = 'http://' + os.hostname() + ':' + conf.port +'/'+pPackageInfo.name + pRouteMap[i].path + ' : '+ pRouteMap[i].description;
			}
			display.changelog = changelogjson;
			res.respond(display,200);
		});
	};
}

module.exports = Info;