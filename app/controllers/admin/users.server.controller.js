'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./../errors.server.controller.js'),
	User = mongoose.model('User'),
	Adminuser = mongoose.model('Adminuser'),
	_ = require('lodash');

/**
 * Create a Adminuser
 */
exports.create = function(req, res) {
	var adminuser = new Adminuser(req.body);
	adminuser.user = req.user;

	adminuser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adminuser);
		}
	});
};

/**
 * Show the current Adminuser
 */
exports.read = function(req, res) {
	res.jsonp(req.adminuser);
};

/**
 * Update a Adminuser
 */
exports.update = function(req, res) {
	var adminuser = req.adminuser ;

	adminuser = _.extend(adminuser , req.body);

	adminuser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adminuser);
		}
	});
};

/**
 * Delete an Adminuser
 */
exports.delete = function(req, res) {
	var adminuser = req.adminuser ;

	adminuser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adminuser);
		}
	});
};

/**
 * List of Adminusers
 */
exports.list = function(req, res) { 
	User.find().sort('-created').populate('user', 'displayName').exec(function(err, adminusers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(adminusers);
		}
	});
};

/**
 * Adminuser middleware
 */
exports.adminuserByID = function(req, res, next, id) { 
	Adminuser.findById(id).populate('user', 'displayName').exec(function(err, adminuser) {
		if (err) return next(err);
		if (! adminuser) return next(new Error('Failed to load Adminuser ' + id));
		req.adminuser = adminuser ;
		next();
	});
};

/**
 * Adminuser authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.adminuser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
