'use strict';

(function() {
	// Adminusers Controller Spec
	describe('Adminusers Controller Tests', function() {
		// Initialize global variables
		var AdminusersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
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

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Adminusers controller.
			AdminusersController = $controller('AdminusersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Adminuser object fetched from XHR', inject(function(Adminusers) {
			// Create sample Adminuser using the Adminusers service
			var sampleAdminuser = new Adminusers({
				name: 'New Adminuser'
			});

			// Create a sample Adminusers array that includes the new Adminuser
			var sampleAdminusers = [sampleAdminuser];

			// Set GET response
			$httpBackend.expectGET('adminusers').respond(sampleAdminusers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.adminusers).toEqualData(sampleAdminusers);
		}));

		it('$scope.findOne() should create an array with one Adminuser object fetched from XHR using a adminuserId URL parameter', inject(function(Adminusers) {
			// Define a sample Adminuser object
			var sampleAdminuser = new Adminusers({
				name: 'New Adminuser'
			});

			// Set the URL parameter
			$stateParams.adminuserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/adminusers\/([0-9a-fA-F]{24})$/).respond(sampleAdminuser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.adminuser).toEqualData(sampleAdminuser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Adminusers) {
			// Create a sample Adminuser object
			var sampleAdminuserPostData = new Adminusers({
				name: 'New Adminuser'
			});

			// Create a sample Adminuser response
			var sampleAdminuserResponse = new Adminusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Adminuser'
			});

			// Fixture mock form input values
			scope.name = 'New Adminuser';

			// Set POST response
			$httpBackend.expectPOST('adminusers', sampleAdminuserPostData).respond(sampleAdminuserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Adminuser was created
			expect($location.path()).toBe('/adminusers/' + sampleAdminuserResponse._id);
		}));

		it('$scope.update() should update a valid Adminuser', inject(function(Adminusers) {
			// Define a sample Adminuser put data
			var sampleAdminuserPutData = new Adminusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Adminuser'
			});

			// Mock Adminuser in scope
			scope.adminuser = sampleAdminuserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/adminusers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/adminusers/' + sampleAdminuserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid adminuserId and remove the Adminuser from the scope', inject(function(Adminusers) {
			// Create new Adminuser object
			var sampleAdminuser = new Adminusers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Adminusers array and include the Adminuser
			scope.adminusers = [sampleAdminuser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/adminusers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdminuser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.adminusers.length).toBe(0);
		}));
	});
}());