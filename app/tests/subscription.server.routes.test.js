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
describe.only('Subscription CRUD tests', function() {
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
				title: 'My Subscription',
				keywords: ['women', 'beautiful'],
				cities: ['Sofia', 'Skopje'],
				user: user._id
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
				if (signinErr) {
					done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/api/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) {
							done(subscriptionSaveErr);
						}

						// Get a list of Subscriptions
						agent.get('/api/subscriptions')
							.end(function(subscriptionsGetErr, subscriptionsGetRes) {
								// Handle Subscription save error
								if (subscriptionsGetErr) {
									done(subscriptionsGetErr);
								}

								// Get Subscriptions list
								var subscriptions = subscriptionsGetRes.body;

								// Set assertions
								(subscriptions[0].user._id).should.equal(userId);
								(subscriptions[0].title).should.match(subscription.title);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subscription instance if not logged in', function(done) {
		agent.post('/api/subscriptions')
			.send(subscription)
			.expect(401)
			.end(function(subscriptionSaveErr, subscriptionSaveRes) {
				// Call the assertion callback
				done(subscriptionSaveErr);
			});
	});

	it('should not be able to save Subscription instance if no title is provided', function(done) {
		// Invalidate name field
		subscription.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					done(signinErr);
				}

				// Get the userId
				var userId = user.id;

				// Save a new Subscription
				agent.post('/api/subscriptions')
					.send(subscription)
					.expect(400)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Set message assertion
						(subscriptionSaveRes.body.message).should.match('Please fill Subscription title');
						
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
				agent.post('/api/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) {
							done(subscriptionSaveErr);
						}

						// Update Subscription name
						subscription.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subscription
						agent.put('/api/subscriptions/' + subscriptionSaveRes.body._id)
							.send(subscription)
							.expect(200)
							.end(function(subscriptionUpdateErr, subscriptionUpdateRes) {
								// Handle Subscription update error
								if (subscriptionUpdateErr) {
									done(subscriptionUpdateErr);
								}

								// Set assertions
								(subscriptionUpdateRes.body._id).should.equal(subscriptionSaveRes.body._id);
								(subscriptionUpdateRes.body.title).should.match(subscription.title);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to update Subscription instance if not signed in', function(done) {
		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function(subscriptionSaveErr) {
			// Handle Subscription save error
			if (subscriptionSaveErr) {
				done(subscriptionSaveErr);
			}

			// Update Subscription name
			subscription.title = 'WHY YOU GOTTA BE SO MEAN?';

			// Update existing Subscription
			agent.put('/api/subscriptions/' + subscriptionObj.id)
				.send(subscription)
				.expect(401)
				.end(function(subscriptionUpdateErr, res) {
					(res.body.message).should.match('User is not logged in');
					done();
				});
		});
	});

	it('should not be able to get a list of Subscriptions if not signed in', function(done) {
		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function() {
			// Request Subscriptions
			request(app).get('/api/subscriptions')
				.expect(403)
				.end(function(req, res) {
					(res.body.message).should.match('User is not logged in');
					done();
				});

		});
	});


	it('should be able to get a list of Subscriptions if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					done(signinErr);
				}

				var subscriptionObj = new Subscription(subscription);

				// Save the Subscription
				subscriptionObj.save(function() {
					agent.get('/api/subscriptions')
						.expect(200)
						.end(function(req, res) {
							// Set assertion
							(res.body).should.be.an.Array.with.lengthOf(1);

							// Call the assertion callback
							done();
						});
					});
			});
	});

	it('should not be able to get a single Subscription if not signed in', function(done) {
		// Create new Subscription model instance
		var subscriptionObj = new Subscription(subscription);

		// Save the Subscription
		subscriptionObj.save(function() {
			request(app).get('/api/subscriptions/' + subscriptionObj._id)
				.expect(403)
				.end(function(req, res) {
					(res.body.message).should.match('User is not logged in');
					done();
				});
		});
	});

	it('should be able to get a single Subscription if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) {
					done(signinErr);
				}

				var subscriptionObj = new Subscription(subscription);

				// Save the Subscription
				subscriptionObj.save(function() {
					// Save a new Subscription
					agent.get('/api/subscriptions/' + subscriptionObj.id)
						.expect(200)
						.end(function(err, res) {
							// Handle Subscription save error
							if (err) {
								done(err);
							}
							res.body.should.be.an.Object.with.property('title', subscription.title);
							done();
						});
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
				agent.post('/api/subscriptions')
					.send(subscription)
					.expect(200)
					.end(function(subscriptionSaveErr, subscriptionSaveRes) {
						// Handle Subscription save error
						if (subscriptionSaveErr) done(subscriptionSaveErr);

						// Delete existing Subscription
						agent.delete('/api/subscriptions/' + subscriptionSaveRes.body._id)
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
			request(app).delete('/api/subscriptions/' + subscriptionObj._id)
				.expect(401)
				.end(function(subscriptionDeleteErr, subscriptionDeleteRes) {
					(subscriptionDeleteRes.body.message).should.match('User is not logged in');

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
