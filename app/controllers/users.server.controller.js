'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller.js'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller'),
	{
		list: 	function(req, res) {
			User.find().sort('-created').populate('user', 'displayName').exec(function (err, adminusers) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(adminusers);
				}
			})
		}
	}
);

/**
 * List of Adminusers
 */
//exports.list = function(req, res) {
//	User.find().sort('-created').populate('user', 'displayName').exec(function(err, adminusers) {
//		if (err) {
//			return res.status(400).send({
//				message: errorHandler.getErrorMessage(err)
//			});
//		} else {
//			res.jsonp(adminusers);
//		}
//	});
//};
