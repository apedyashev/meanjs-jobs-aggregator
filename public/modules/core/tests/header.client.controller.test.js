'use strict';

(function() {
	describe('HeaderController', function() {
		//Initialize global variables
		var scope,
			$location,
			$httpBackend,
			Notification,
			HeaderController;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$httpBackend_, _Notification_) {
			scope = $rootScope.$new();
			$location = _$location_;
			$httpBackend = _$httpBackend_;
			Notification = _Notification_;

			HeaderController = $controller('HeaderController', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});

		it('should initialize isCollapsed to false', function() {
			expect(scope.isCollapsed).toBeFalsy();
		});

		it('should provide toggleCollapsibleMenu() that inverts the value of isCollapsed', function() {
			expect(scope.isCollapsed).toBeFalsy();
			scope.toggleCollapsibleMenu();
			expect(scope.isCollapsed).toBeTruthy();
			scope.toggleCollapsibleMenu();
			expect(scope.isCollapsed).toBeFalsy();
		});

		it('should change isCollapsed from true to false after navigation', function() {
			// test initialization
			expect(scope.isCollapsed).toBeFalsy();
			scope.toggleCollapsibleMenu();
			expect(scope.isCollapsed).toBeTruthy();

			//test itself - emulate navigation by triggering $stateChangeSuccess
			scope.$broadcast('$stateChangeSuccess');
			expect(scope.isCollapsed).toBeFalsy();
		});

		it('should provide isMenuActive() that return true if location starts from a substring passed to it', function() {
			$location.path('/dashboard/all-jobs');
			expect(scope.isMenuActive('/dashboard')).toBeTruthy();

			$location.path('/stats/cities');
			expect(scope.isMenuActive('/stats')).toBeTruthy();
		});

		it('should provide isMenuActive() that return false if location does not start from a substring passed to it', function() {
			$location.path('/dashboard/all-jobs');
			expect(scope.isMenuActive('/dashboard1')).toBeFalsy();
		});

		describe(':: signOut', function() {
			it('should send a DELETE request and sets authentication.user to null', function() {
				$httpBackend.expectDELETE('/api/auth').respond(200);
				scope.authentication.user = {
					name: 'some name'
				};

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect(scope.authentication.user).toBe(null);
			});

			it('redirects to / if request was succeed', function() {
				$httpBackend.expectDELETE('/api/auth').respond(200);

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect($location.path()).toBe('/');
			});


			it('calls Notification.showSuccess with success message', function() {
				Notification.showSuccess = jasmine.createSpy('success');
				Notification.showError = jasmine.createSpy('error');

				$httpBackend.expectDELETE('/api/auth').respond(200);

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect(Notification.showSuccess).toHaveBeenCalled();
				expect(Notification.showError).not.toHaveBeenCalled();
				expect(Notification.showSuccess.calls.mostRecent().args[0]).toEqual('Signed out');
			});

			it('calls Notification.showError with response.data.message', function() {
				var errorMessage = 'very bad';
				Notification.showSuccess = jasmine.createSpy('success');
				Notification.showError = jasmine.createSpy('error');

				$httpBackend.expectDELETE('/api/auth').respond(400, {
					data: {
						message: errorMessage
					}
				});

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect(Notification.showSuccess).not.toHaveBeenCalled();
				expect(Notification.showError).toHaveBeenCalled();
				expect(Notification.showError.calls.mostRecent().args[0]).toEqual(errorMessage);
			});

			it('calls Notification.showError with response.message', function() {
				var errorMessage = 'Oh snap!';
				Notification.showSuccess = jasmine.createSpy('success');
				Notification.showError = jasmine.createSpy('error');

				$httpBackend.expectDELETE('/api/auth').respond(400, {
					message: errorMessage
				});

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect(Notification.showSuccess).not.toHaveBeenCalled();
				expect(Notification.showError).toHaveBeenCalled();
				expect(Notification.showError.calls.mostRecent().args[0]).toEqual(errorMessage);
			});

			it('calls Notification.showError with "Unknown error"', function() {
				var errorMessage = 'Unknown error';
				Notification.showSuccess = jasmine.createSpy('success');
				Notification.showError = jasmine.createSpy('error');

				$httpBackend.expectDELETE('/api/auth').respond(400);

				// Run controller functionality
				scope.signOut();
				$httpBackend.flush();

				expect(Notification.showSuccess).not.toHaveBeenCalled();
				expect(Notification.showError).toHaveBeenCalled();
				expect(Notification.showError.calls.mostRecent().args[0]).toEqual(errorMessage);
			});
		});
	});
})();
