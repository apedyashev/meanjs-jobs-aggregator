'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	subscriptionController = require('./subscriptions.server.controller'),
	Job = mongoose.model('Job'),
	Subscription = mongoose.model('Subscription'),
	util = require('util'),
	_ = require('lodash');

/**
 * Create a Job
 */
exports.create = function(req, res) {
	var job = new Job(req.body);
	job.user = req.user;

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Show the current Job
 */
exports.read = function(req, res) {
	res.jsonp(req.job);
};

/**
 * Update a Job
 */
exports.update = function(req, res) {
	var job = req.job ;

	job = _.extend(job , req.body);

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Delete an Job
 */
exports.delete = function(req, res) {
	var job = req.job ;

	job.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * List of Jobs (all or for specific subscription, if subscriptionId is defined in query string)
 */
exports.list = function(req, res) {
	var findJobs = function(subscription) {
		var query = {},
			$or = [];

		if (subscription) {
			subscription.keywords.forEach(function(keyword) {
				$or.push({
					short_description: new RegExp(keyword, 'i')
				});
				$or.push({
					title: new RegExp(keyword, 'i')
				});
			});

			query = {
				city: {
					$in: subscription.cities
				},
				$or: $or
			};
		}

		var limit = req.query.limit || 20,
			offset = req.query.offset || 0;
		Job.find(query).sort('-created').limit(limit).skip(offset).populate('user', 'displayName').exec(function(err, jobs) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(jobs);
			}
		});
	};

	if (req.query.subscriptionId) {
		subscriptionController.subscriptionByID(req, res, function(err) {
			findJobs(req.subscription);
		}, req.query.subscriptionId);
	}
	else {
		findJobs();
	}

};

exports.stats = function (req, res) {
	Job.aggregate([
		{$group: {
			_id: null,
			cities: {
				$addToSet: '$city'
			},
			availabilities: {
				$addToSet: '$availability'
			}
		}}
	], function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var statsData = results[0] || {};
			delete statsData._id;
			res.jsonp(statsData);
		}
	});

};

/**
 * Job middleware
 */
exports.jobByID = function(req, res, next, id) { 
	Job.findById(id).populate('user', 'displayName').exec(function(err, job) {
		if (err) return next(err);
		if (! job) return next(new Error('Failed to load Job ' + id));
		req.job = job ;
		next();
	});
};

/**
 * Job authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.job.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
