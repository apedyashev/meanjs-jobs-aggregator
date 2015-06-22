'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$http', 'Authentication', 'Menus', 'Notification',
	function($scope, $location, $http, Authentication, Menus, Notification) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.isMenuActive = function (section) {
			var re = new RegExp('^' + section);
			return re.test($location.path());
		};

		$scope.isSigningOut = false;
		$scope.signOut = function() {
			$scope.isSigningOut = true;
			$http.delete('/api/auth')
				.success(function() {
					$scope.isSigningOut = false;
					Notification.showSuccess('Signed out');
					$scope.authentication.user = null;
					$location.path('/');
				})
				.error(function(response) {
					$scope.isSigningOut = false;
					var message = (response.data && response.data.message) ? response.data.message : response.message;
					Notification.showError(message || 'Unknown error');
				});
		};

	}
]);
