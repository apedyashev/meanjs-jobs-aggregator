'use strict';

(function() {
	// Sidebar Controller Spec
	describe('Sidebar Controller', function() {
		// Initialize global variables
		var SidebarController,
			scope,
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
		beforeEach(inject(function($controller, $rootScope, _$location_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$location = _$location_;

			// Initialize the Sidebar controller.
			SidebarController = $controller('SidebarController', {
				$scope: scope
			});
		}));

		it('should initialize isMenuVisible to false', function() {
			expect(scope.isMenuVisible).toBeFalsy();
		});

		it('inversts the value of isMenuVisible after each toggleMenu() function call', function() {
			expect(scope.isMenuVisible).toBeFalsy();
			scope.toggleMenu();
			expect(scope.isMenuVisible).toBeTruthy();
			scope.toggleMenu();
			expect(scope.isMenuVisible).toBeFalsy();
		});

		describe('provides the isItemActive() function', function() {
			it('that returns true if passed argument is equal to $location.path()', function() {
				var itemPath = '/some/path/to/resource';
				$location.path(itemPath);

				expect(scope.isItemActive(itemPath)).toBeTruthy();
			});

			it('that returns false if passed argument is  NOT equal to $location.path()', function() {
				var itemPath = '/some/path/to/resource';
				$location.path(itemPath);

				expect(scope.isItemActive(itemPath + '/123456')).toBeFalsy();
			});
		});
	});
}());
