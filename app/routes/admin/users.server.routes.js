'use strict';

module.exports = function(app) {
	var users = require('../../controllers/users.server.controller.js');
	var adminusers = require('../../controllers/admin/users.server.controller.js');

	// Adminusers Routes
	app.route('/api/admin/users')
		.get(adminusers.list)
		.post(users.requiresLogin, adminusers.create);

	app.route('/api/admin/users/:id')
		.get(adminusers.read)
		.put(users.requiresLogin, adminusers.hasAuthorization, adminusers.update)
		.delete(users.requiresLogin, adminusers.hasAuthorization, adminusers.delete);

	// Finish by binding the Adminuser middleware
	app.param('id', adminusers.adminuserByID);
};
