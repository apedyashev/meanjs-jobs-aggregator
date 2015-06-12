'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subscription = mongoose.model('Subscription'),
	_ = require('lodash');

/**
 * Create a Subscription
 */
exports.create = function(req, res) {
	var subscription = new Subscription(req.body);
	subscription.user = req.user;

	subscription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subscription);
		}
	});
};

/**
 * Show the current Subscription
 */
exports.read = function(req, res) {
	res.jsonp(req.subscription);
};

/**
 * Update a Subscription
 */
exports.update = function(req, res) {
	var subscription = req.subscription ;

	subscription = _.extend(subscription , req.body);

	subscription.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subscription);
		}
	});
};

/**
 * Delete an Subscription
 */
exports.delete = function(req, res) {
	var subscription = req.subscription ;

	subscription.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subscription);
		}
	});
};

/**
 * List of Subscriptions
 */
exports.list = function(req, res) { 
	Subscription.find().sort('-created').populate('user', 'displayName').exec(function(err, subscriptions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subscriptions);
		}
	});
};

/**
 * Subscription middleware
 */
exports.subscriptionByID = function(req, res, next, id) { 
	Subscription.findById(id).populate('user', 'displayName').exec(function(err, subscription) {
		if (err) return next(err);
		if (! subscription) return next(new Error('Failed to load Subscription ' + id));

		if (subscription.user.id !== req.user.id) {
			return next(new Error('You are not allowed to use this subscription ' + id));
		}

		req.subscription = subscription ;
		next();
	});
};

/**
 * Subscription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.subscription.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
