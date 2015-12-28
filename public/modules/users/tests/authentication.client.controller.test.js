'use strict';

(function() {
	// Authentication controller Spec
	describe('AuthenticationController', function() {
		// Initialize global variables
		var AuthenticationController,
			scope,
			$httpBackend,
			Notification,
			$location;

		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _Notification_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			Notification = _Notification_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Authentication controller
			AuthenticationController = $controller('AuthenticationController', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});

		it('should redirect to the dashboard if user logged in', inject(function($controller) {
			scope.authentication.user = {
				name: 'user #1'
			};
			AuthenticationController = $controller('AuthenticationController', {
				$scope: scope
			});

			expect($location.path()).toEqual('/dashboard');
		}));

		describe('$scope.signup()', function() {
			it('should login user if it sugned up successfully', function() {
				// Test expected GET request
				$httpBackend.when('POST', '/api/auth/signup').respond(200, 'Fred');

				scope.signup();
				$httpBackend.flush();

				// Test scope value
				expect(scope.authentication.user).toEqual('Fred');
				expect($location.url()).toEqual('/');
			});

			it('should call Notification.showError in case of error', function() {
				var errorMessage = 'Signup error',
					responseMock = {
						message: errorMessage
					};
				Notification.showError = jasmine.createSpy('error');

				// Test expected GET request
				$httpBackend.when('POST', '/api/auth/signup').respond(404, responseMock);

				scope.signup();
				$httpBackend.flush();

				// Test scope value
				expect(scope.authentication.user).toBeUndefined();
				expect(Notification.showError).toHaveBeenCalled();
				expect(Notification.showError.calls.mostRecent().args[0]).toEqual(errorMessage);
			});
		});


		describe('$scope.signin()', function() {
			it('$scope.authentication.user to value returned by API', function() {
				// Test expected GET request
				$httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

				scope.signin();
				$httpBackend.flush();

				// Test scope value
				expect(scope.authentication.user).toEqual('Fred');
				expect($location.url()).toEqual('/dashboard');
			});

			it('should call Notification.showError in case of error', function() {
				var errorMessage = 'Signin error',
					responseMock = {
						message: errorMessage
					};
				Notification.showError = jasmine.createSpy('error');

				// Test expected GET request
				$httpBackend.when('POST', '/api/auth/signin').respond(404, responseMock);

				scope.signin();
				$httpBackend.flush();

				// Test scope value
				expect(scope.authentication.user).toBeUndefined();
				expect(Notification.showError).toHaveBeenCalled();
				expect(Notification.showError.calls.mostRecent().args[0]).toEqual(errorMessage);
			});
		});
	});
}());
