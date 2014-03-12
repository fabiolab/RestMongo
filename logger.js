var winston = require('winston');
var conf = require('./conf/log_conf.json');

function Logger() {
	if (Logger.caller != Logger.getInstance) {
		console.log('Error : create object with instance');
	}
}

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	json : false,
	timestamp : true,
	level : conf.level
});

winston.add(winston.transports.File, {
	filename : conf.dir + conf.log_file,
	timestamp : true,
	json : false,
	level : conf.level,
	 maxsize : conf.max_size,
	 maxFiles : conf.max_files
});

winston.handleExceptions(new winston.transports.File({
	filename : conf.dir + conf.exception_file,
	timestamp : true,
	json : false,
	handleExceptions : true,
	level : conf.level,
	 maxsize : conf.max_size,
	 maxFiles : conf.max_files
}));

Logger.instance = null;

Logger.getInstance = function() {
	return winston;
};

module.exports = Logger;
