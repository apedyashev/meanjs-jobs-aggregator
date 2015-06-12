'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subscription = mongoose.model('Subscription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subscription;

/**
 * Subscription routes tests
 */
describe('Subscription CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Subscription
		user.save(function() {
			subscription = {
				name: 'Subscription Name'
			};

			done();
		});
	});

	it('should be able to save Subscription instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) done(subscriptionSaveErr);

						// Get a list of Subscriptions
						agent.get('/subscriptions')
							.end(function(subscriptionsGetErr, subscriptionsGetRes) {
								// Handle Subscription save error
								if (subscriptionsGetErr) done(subscriptionsGetErr);

								// Get Subscriptions list
								var subscriptions = subscriptionsGetRes.body;

								// Set assertions
								(subscriptions[0].user._id).should.equal(userId);
								(subscriptions[0].name).should.match('Subscription Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subscription instance if not logged in', function(done) {
		agent.post('/subscriptions')
			.send(subscription)
			.expect(401)
			.end(function(subscriptionSaveErr, subscriptionSaveRes) {
				// Call the assertion callback
				done(subscriptionSaveErr);
			});
	});

	it('should not be able to save Subscription instance if no name is provided', function(done) {
		// Invalidate name field
		subscription.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/subscriptions')
					.send(subscription)
					.expect(400)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Set message assertion
						(subscriptionSaveRes.body.message).should.match('Please fill Subscription name');
						
						// Handle Subscription save error
						done(subscriptionSaveErr);
					});
			});
	});

	it('should be able to update Subscription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) done(subscriptionSaveErr);

						// Update Subscription name
						subscription.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subscription
						agent.put('/subscriptions/' + subscriptionSaveRes.body._id)
							.send(subscription)
							.expect(200)
							.end(function(subscriptionUpdateErr, subscriptionUpdateRes) {
								// Handle Subscription update error
								if (subscriptionUpdateErr) done(subscriptionUpdateErr);

								// Set assertions
								(subscriptionUpdateRes.body._id).should.equal(subscriptionSaveRes.body._id);
								(subscriptionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Subscriptions if not signed in', function(done) {
		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function() {
			// Request Subscriptions
			request(app).get('/subscriptions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Subscription if not signed in', function(done) {
		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function() {
			request(app).get('/subscriptions/' + subscriptionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', subscription.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Subscription instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) done(subscriptionSaveErr);

						// Delete existing Subscription
						agent.delete('/subscriptions/' + subscriptionSaveRes.body._id)
							.send(subscription)
							.expect(200)
							.end(function(subscriptionDeleteErr, subscriptionDeleteRes) {
								// Handle Subscription error error
								if (subscriptionDeleteErr) done(subscriptionDeleteErr);

								// Set assertions
								(subscriptionDeleteRes.body._id).should.equal(subscriptionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Subscription instance if not signed in', function(done) {
		// Set Subscription user 
		subscription.user = user;

		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function() {
			// Try deleting Subscription
			request(app).delete('/subscriptions/' + subscriptionObj._id)
			.expect(401)
			.end(function(subscriptionDeleteErr, subscriptionDeleteRes) {
				// Set message assertion
				(subscriptionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Subscription error error
				done(subscriptionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Subscription.remove().exec();
		done();
	});
});