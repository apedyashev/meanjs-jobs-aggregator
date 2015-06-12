'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subscriptions = require('../../app/controllers/subscriptions.server.controller');

	// Subscriptions Routes
	app.route('/api/subscriptions')
		.get(subscriptions.list)
		.post(users.requiresLogin, subscriptions.create);

	app.route('/api/subscriptions/:subscriptionId')
		.get(subscriptions.read)
		.put(users.requiresLogin, subscriptions.hasAuthorization, subscriptions.update)
		.delete(users.requiresLogin, subscriptions.hasAuthorization, subscriptions.delete);

	// Finish by binding the Subscription middleware
	app.param('subscriptionId', subscriptions.subscriptionByID);
};
