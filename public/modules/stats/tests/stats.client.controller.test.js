'use strict';

(function() {
	// Stats Controller Spec
	describe('Stats Controller', function() {
		// Initialize global variables
		var StatsController,
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

			// Initialize the Stats controller.
			StatsController = $controller('StatsController', {
				$scope: scope
			});
		}));

		it('should fetch stats using GET method', inject(function() {
			var statsMock = {
				cities: [],
				availabilities: []
			};
			$httpBackend.expectGET(/^\/api\/jobs\/stats/).respond(200, statsMock);
			$httpBackend.flush();

			expect(scope.stats).toEqualData(statsMock);
			expect(scope.maxCityCount).toBe(0);
			expect(scope.totalJobs).toBe(0);
			expect(scope.maxAvailCount).toBe(0);
		}));

		it('should set maxCityCount to the max value of cities[].count and totalJobs to summ of cities[].count', inject(function() {
			var statsMock = {
				cities: [{
					name: 'city1',
					count: 8
				}, {
					name: 'city2',
					count: 10
				}, {
					name: 'city3',
					count: 9
				}],
				availabilities: []
			};
			$httpBackend.expectGET(/^\/api\/jobs\/stats/).respond(200, statsMock);
			$httpBackend.flush();

			expect(scope.maxCityCount).toBe(10);
			expect(scope.totalJobs).toBe(27);
			expect(scope.maxAvailCount).toBe(0);
		}));

		it('should set maxAvailCount to the max value of availabilities[].count', inject(function() {
			var statsMock = {
				cities: [],
				availabilities: [{
					name: 'a-10%',
					count: 5
				}, {
					name: 'a-5%',
					count: 6
				}, {
					name: 'a-1%',
					count: 4
				}]
			};
			$httpBackend.expectGET(/^\/api\/jobs\/stats/).respond(200, statsMock);
			$httpBackend.flush();

			expect(scope.maxCityCount).toBe(0);
			expect(scope.totalJobs).toBe(0);
			expect(scope.maxAvailCount).toBe(6);
		}));
	});
}());
