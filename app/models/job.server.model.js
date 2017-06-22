'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	title: {
		type: String
	},
	shortDescription: {
		type: String
	},
	levelOfEmployment: {
		type: String
	},
	city: {
		type: String
	},
	company: {
		type: String
	},
	datePosted: {
		type: Date
	},
	link: {
		type: String,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Job', JobSchema);
