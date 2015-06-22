'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller'),
		indexRoutes = ['/', '/signup', '/signin', '/dashboard*', '/settings*', '/statistics'];
	indexRoutes.forEach(function(route) {
		app.route(route).get(core.index);
	});
};
