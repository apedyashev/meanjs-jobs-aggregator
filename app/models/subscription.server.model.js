'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subscription Schema
 */
var SubscriptionSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Subscription title',
		trim: true
	},
	keywords: {
		type: Array
	},
	cities: {
		type: Array
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Subscription', SubscriptionSchema);
