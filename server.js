'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
	Promise = require('bluebird');

mongoose.Promise = Promise;
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

var app;
mongoose
    .connect(config.db, {auto_reconnect: true })
    .then(function (connection) {
			// Init the express application
			app = require('./config/express')(connection.db);

			// Bootstrap passport config
			require('./config/passport')();

			// Start the app by listening on <port>
			app.listen(config.port);
    })
    .catch(function (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });



// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

const runScrapper = require('./app/libs/scrapper');
setInterval(() => {
  runScrapper();
}, config.scrapper.importInterval);

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
