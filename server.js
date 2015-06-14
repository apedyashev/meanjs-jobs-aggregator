'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

var oneHour = config.scrapper.importInterval;
setInterval(function () {
	var scrapper = require('./app/libs/scrapper')();
	console.error(chalk.green('Scrapping started'));
	scrapper.run(function(err, jobs) {
		if (err) {
			console.error(chalk.red('Error while scrapping'), err);
		} else {
			console.log('Scrapping done');
		}
	});
},oneHour);
