'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		jobs = require('../../app/controllers/jobs.server.controller'),
		apiMiddleware = require('../middleware/api');

	// Jobs Routes
	app.route('/api/jobs/stats')
		.get(apiMiddleware, jobs.stats);

	app.route('/api/jobs')
		.get(apiMiddleware, jobs.list);
};
