'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var jobs = require('../../app/controllers/jobs.server.controller');

	// Jobs Routes
	app.route('/api/jobs/stats')
		.get(jobs.stats);

	app.route('/api/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.create);

	app.route('/api/jobs/:jobId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
		.delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);

	// Finish by binding the Job middleware
	app.param('jobId', jobs.jobByID);
};
