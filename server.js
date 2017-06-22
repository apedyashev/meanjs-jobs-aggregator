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

// setInterval(function () {
// 	var scrapper = require('./app/libs/scrapper')();
// 	console.error(chalk.green('Scrapping started'));
// 	scrapper.run(function(err, jobs) {
// 		if (err) {
// 			console.error(chalk.red('Error while scrapping'), err);
// 		} else {
// 			console.error(chalk.green('Scrapping done'));
// 		}
// 	});
// }, config.scrapper.importInterval);

/**
 * Remove jobs older than 1 month
 */
var ONE_MONTH = 360000 * 24;
setInterval(function () {
	var Job = mongoose.model('Job'),
		today = new Date(),
		monthAgo = today.setMonth(today.getMonth() - 1);
	Job.find({created: {$lt: monthAgo}}).remove().exec(function(err, removed) {
		if (err) {
			console.error(chalk.red('Error while removing old documents'), err);
		}
		else {
			console.error(chalk.green('Old documents removed: ' + removed));
		}
	});
}, ONE_MONTH);
