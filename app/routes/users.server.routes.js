'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller'),
		apiMiddleware = require('../middleware/api');



	// Setting up the users profile api
	app.route('/api/users/me').get(apiMiddleware, users.me);
	app.route('/api/users').get(apiMiddleware, users.hasAuthorization(['admin']), users.list);
	app.route('/api/users').put(apiMiddleware, users.update);
	app.route('/api/users/accounts').delete(apiMiddleware, users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/api/users/password').post(apiMiddleware, users.changePassword);
	app.route('/api/auth/forgot').post(apiMiddleware, users.forgot);
	app.route('/api/auth/reset/:token').get(apiMiddleware, users.validateResetToken);
	app.route('/api/auth/reset/:token').post(apiMiddleware, users.reset);

	// Setting up the users authentication api
	app.route('/api/auth/signup').post(apiMiddleware, users.signup);
	app.route('/api/auth/signin').post(apiMiddleware, users.signin);
	app.route('/api/auth/signout').get(apiMiddleware, users.signout);
	app.route('/auth/signout').get(apiMiddleware, users.signout);
	app.route('/api/auth').delete(apiMiddleware, users.signout);


	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
