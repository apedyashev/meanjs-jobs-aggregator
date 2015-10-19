'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller'),
		indexRoutes = ['/', '/signup', '/signin', '/dashboard*', '/settings*', '/statistics'],
		apiMiddleware = require('../middleware/api');

	indexRoutes.forEach(function(route) {
		app.route(route).get(core.index);
	});

	app.route('*').options(apiMiddleware, function(req, res) {
		res.json();
	});
};
