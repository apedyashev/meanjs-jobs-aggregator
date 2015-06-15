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
	async = require('async'),
	_ = require('lodash');


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
	var paramsMap = [
			{
				queryName: 'cities',
				dbName: 'city'
			},
			{
				queryName: 'availabilities',
				dbName: 'availability'
			}
		],
		allowedQueryNames = {
			cities: true,
			availabilities: true
		};

	async.map(paramsMap, function(paramData, done) {
		if (req.query[paramData.queryName] && allowedQueryNames[paramData.queryName]) {
			var firstGroup = {
					_id: {},
					count: {
						$sum: 1
					}
				},
				secondGroup = {
					_id: null
				};
			firstGroup._id[paramData.dbName] = { $ifNull: [ '$' + paramData.dbName, 'N/A' ] };
			secondGroup[paramData.queryName] = {
				$addToSet: {
					name: '$_id.' + paramData.dbName,
					count: '$count'
				}
			};
			Job.aggregate([
				{
					$group: firstGroup
				},
				{
					$group: secondGroup
				}
			], function(err, results) {

				if (err) {
					done(err);
				} else {
					var statsData = results[0] || {};
					delete statsData._id;
					done(null, statsData);
				}
			});
		}
		else {
			done(null, {});
		}
	}, function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var statsData = {};
			results.forEach(function(dbResults) {
				paramsMap.forEach(function(paramData) {
					if (dbResults[paramData.queryName]) {
						statsData[paramData.queryName] = dbResults[paramData.queryName];
					}
				});
			});
			res.jsonp(statsData);
		}
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
