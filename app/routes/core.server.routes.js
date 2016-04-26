'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller'),
		adminCore = require('../../app/controllers/admin/core.server.controller'),
		indexRoutes = ['/', '/signup', '/signin', '/dashboard*', '/settings*', '/statistics'],
		adminRoutes = ['/admin*'],
		apiMiddleware = require('../middleware/api');

	indexRoutes.forEach(function(route) {
		app.route(route).get(core.index);
	});

	adminRoutes.forEach(function(route) {
		app.route(route).get(adminCore.index);
	});

	app.route('/api/*').options(apiMiddleware, function(req, res) {
		res.json();
	});
};
