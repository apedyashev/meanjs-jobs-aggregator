'use strict';

var should = require('should'),
	shouldHttp = require('should-http'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Job = mongoose.model('Job'),
	Subscription = mongoose.model('Subscription'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, jobs, subscription;

/**
 * Job routes tests
 */

describe('Job CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			email: 'test@test.com',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: credentials.email,
			username: 'username',
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Job
		user.save(function() {
			jobs = [{
					title: 'Job 1',
					shortDescription: 'short description',
					levelOfEmployment: '100%',
					city: 'Jericho',
					company: 'company xxx',
					datePosted: Date.now(),
					link: 'http://ya.ru'
				},
				{
					title: 'Job 2',
					shortDescription: 'short description with node keyword',
					levelOfEmployment: '80%',
					city: 'Belgrade',
					company: 'company xxx2',
					datePosted: Date.now(),
					link: 'http://ya1.ru'
				},
				{
					title: 'Job 3',
					shortDescription: 'short description with test keyword',
					levelOfEmployment: '100%',
					city: 'Moscow',
					company: 'company xxx3',
					datePosted: Date.now(),
					link: 'http://ya2.ru'
				}
			];

			subscription = {
				title: 'Test subscription',
				keywords: ['test', 'node'],
				cities: ['Belgrade', 'Moscow'],
				user: user._id
			};

			done();
		});
	});

	it('should be able to get a list of ALL Jobs if not signed in', function(done) {
		Job.collection.insert(jobs, function() {
			// Request Jobs
			request(app).get('/api/jobs')
				.end(function(req, res) {
					res.body.should.be.an.Array.with.lengthOf(3);

					done();
				});
		});
	});

	it('should NOT be able to get list of Jobs by subscriptionId if not signed in', function(done) {
		Job.collection.insert(jobs, function() {
			var subscriptionModel = new Subscription(subscription);
			subscriptionModel.save(function() {
				agent.get('/api/jobs?subscriptionId=' + subscriptionModel.id)
					.expect(401)
					.end(function(jobSaveErr, jobSaveRes) {
						Subscription.remove().exec();
						// Call the assertion callback
						done(jobSaveErr);
					});
			});
		});
	});

	it('should be able to get list of Jobs by subscriptionId if signed in', function(done) {
		Job.collection.insert(jobs, function(err) {
			if (err) {
				done(err);
			}

			agent.post('/api/auth/signin')
				.send(credentials)
				.expect(200)
				.end(function(signinErr, signinRes) {
					// Handle signin error
					if (signinErr) {
						done(signinErr);
					}

					var subscriptionModel = new Subscription(subscription);
					subscriptionModel.save(function() {
						agent.get('/api/jobs')
							.query({subscriptionId: subscriptionModel.id})
							.expect(200)
							.end(function(req, res) {
								// 2 items are expected - the 1st one is found by keyword and 2nd one by city
								res.body.should.be.an.Array.with.lengthOf(2);

								done();
							});
					});
				});
		});
	});


	it('should be able to get jobs statistics', function(done) {
		Job.collection.insert(jobs, function(err) {
			if (err) {
				return done(err);
			}

			request(app).get('/api/jobs/stats?availabilities=true&cities=true')
				.end(function(req, res) {
					res.should.have.status(200);
					res.body.cities.should.be.an.Array.with.lengthOf(3);
					res.body.availabilities.should.be.an.Array.with.lengthOf(2);

					done();
				});
			});
	});


	afterEach(function(done) {
		User.remove().exec();
		Job.remove().exec();
		Subscription.remove().exec();
		done();
	});
});
