'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Adminuser = mongoose.model('Adminuser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, adminuser;

/**
 * Adminuser routes tests
 */
describe('Adminuser CRUD tests', function() {
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

		// Save a user to the test db and create new Adminuser
		user.save(function() {
			adminuser = {
				name: 'Adminuser Name'
			};

			done();
		});
	});

	it('should be able to save Adminuser instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Adminuser
				agent.post('/adminusers')
					.send(adminuser)
					.expect(200)
					.end(function(adminuserSaveErr, adminuserSaveRes) {
						// Handle Adminuser save error
						if (adminuserSaveErr) done(adminuserSaveErr);

						// Get a list of Adminusers
						agent.get('/adminusers')
							.end(function(adminusersGetErr, adminusersGetRes) {
								// Handle Adminuser save error
								if (adminusersGetErr) done(adminusersGetErr);

								// Get Adminusers list
								var adminusers = adminusersGetRes.body;

								// Set assertions
								(adminusers[0].user._id).should.equal(userId);
								(adminusers[0].name).should.match('Adminuser Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Adminuser instance if not logged in', function(done) {
		agent.post('/adminusers')
			.send(adminuser)
			.expect(401)
			.end(function(adminuserSaveErr, adminuserSaveRes) {
				// Call the assertion callback
				done(adminuserSaveErr);
			});
	});

	it('should not be able to save Adminuser instance if no name is provided', function(done) {
		// Invalidate name field
		adminuser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Adminuser
				agent.post('/adminusers')
					.send(adminuser)
					.expect(400)
					.end(function(adminuserSaveErr, adminuserSaveRes) {
						// Set message assertion
						(adminuserSaveRes.body.message).should.match('Please fill Adminuser name');
						
						// Handle Adminuser save error
						done(adminuserSaveErr);
					});
			});
	});

	it('should be able to update Adminuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Adminuser
				agent.post('/adminusers')
					.send(adminuser)
					.expect(200)
					.end(function(adminuserSaveErr, adminuserSaveRes) {
						// Handle Adminuser save error
						if (adminuserSaveErr) done(adminuserSaveErr);

						// Update Adminuser name
						adminuser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Adminuser
						agent.put('/adminusers/' + adminuserSaveRes.body._id)
							.send(adminuser)
							.expect(200)
							.end(function(adminuserUpdateErr, adminuserUpdateRes) {
								// Handle Adminuser update error
								if (adminuserUpdateErr) done(adminuserUpdateErr);

								// Set assertions
								(adminuserUpdateRes.body._id).should.equal(adminuserSaveRes.body._id);
								(adminuserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Adminusers if not signed in', function(done) {
		// Create new Adminuser model instance
		var adminuserObj = new Adminuser(adminuser);

		// Save the Adminuser
		adminuserObj.save(function() {
			// Request Adminusers
			request(app).get('/adminusers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Adminuser if not signed in', function(done) {
		// Create new Adminuser model instance
		var adminuserObj = new Adminuser(adminuser);

		// Save the Adminuser
		adminuserObj.save(function() {
			request(app).get('/adminusers/' + adminuserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', adminuser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Adminuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Adminuser
				agent.post('/adminusers')
					.send(adminuser)
					.expect(200)
					.end(function(adminuserSaveErr, adminuserSaveRes) {
						// Handle Adminuser save error
						if (adminuserSaveErr) done(adminuserSaveErr);

						// Delete existing Adminuser
						agent.delete('/adminusers/' + adminuserSaveRes.body._id)
							.send(adminuser)
							.expect(200)
							.end(function(adminuserDeleteErr, adminuserDeleteRes) {
								// Handle Adminuser error error
								if (adminuserDeleteErr) done(adminuserDeleteErr);

								// Set assertions
								(adminuserDeleteRes.body._id).should.equal(adminuserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Adminuser instance if not signed in', function(done) {
		// Set Adminuser user 
		adminuser.user = user;

		// Create new Adminuser model instance
		var adminuserObj = new Adminuser(adminuser);

		// Save the Adminuser
		adminuserObj.save(function() {
			// Try deleting Adminuser
			request(app).delete('/adminusers/' + adminuserObj._id)
			.expect(401)
			.end(function(adminuserDeleteErr, adminuserDeleteRes) {
				// Set message assertion
				(adminuserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Adminuser error error
				done(adminuserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Adminuser.remove().exec();
		done();
	});
});