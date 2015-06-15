'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var jobs = require('../../app/controllers/jobs.server.controller');

	// Jobs Routes
	app.route('/api/jobs/stats')
		.get(jobs.stats);

	app.route('/api/jobs')
		.get(jobs.list);
};
