'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subscription = mongoose.model('Subscription');

/**
 * Globals
 */
var user, subscription;

/**
 * Unit tests
 */
describe('Subscription Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			subscription = new Subscription({
				title: 'My Subscription',
				keywords: ['women', 'beautiful'],
				cities: ['Sofia', 'Skopje'],
				user: user._id
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return subscription.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			subscription.title = '';

			return subscription.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Subscription.remove().exec();
		User.remove().exec();

		done();
	});
});
