'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Adminuser Schema
 */
var AdminuserSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Adminuser name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Adminuser', AdminuserSchema);