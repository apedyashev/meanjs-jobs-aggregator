'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		subscriptions = require('../../app/controllers/subscriptions.server.controller'),
		apiMiddleware = require('../middleware/api');

	// Subscriptions Routes
	app.route('/api/subscriptions')
		.get(apiMiddleware, users.requiresLogin, subscriptions.list)
		.post(apiMiddleware, users.requiresLogin, subscriptions.create);

	app.route('/api/subscriptions/:subscriptionId')
		.get(apiMiddleware, users.requiresLogin, subscriptions.hasAuthorization, subscriptions.read)
		.put(apiMiddleware, users.requiresLogin, subscriptions.hasAuthorization, subscriptions.update)
		.delete(apiMiddleware, users.requiresLogin, subscriptions.hasAuthorization, subscriptions.delete);

	// Finish by binding the Subscription middleware
	app.param('subscriptionId', subscriptions.subscriptionByID);
};
