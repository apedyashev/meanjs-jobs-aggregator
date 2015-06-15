'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Job = mongoose.model('Job'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, job;

/**
 * Job routes tests
 */
describe('Job CRUD tests', function() {
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

		// Save a user to the test db and create new Job
		user.save(function() {
			job = {
				name: 'Job Name'
			};

			done();
		});
	});

	it('should be able to get a list of Jobs if not signed in', function(done) {
		// Create new Job model instance
		var jobObj = new Job(job);

		// Save the Job
		jobObj.save(function() {
			// Request Jobs
			request(app).get('/jobs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	afterEach(function(done) {
		User.remove().exec();
		Job.remove().exec();
		done();
	});
});
