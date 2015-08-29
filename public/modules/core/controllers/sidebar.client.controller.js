'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$location',
	function($scope, $location) {
		// Sidebar controller logic
		// ...

		// (For mobile devices ONLY)
		$scope.toggleMenu = function() {
			$scope.isMenuVisible = !$scope.isMenuVisible;
		};

		// Collapsing the menu after navigation (For mobile devices ONLY)
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isMenuVisible = false;
		});

		// TODO: temporary solution. Must be isItemActive
		// see http://stackoverflow.com/questions/32286671/why-directives-method-is-available-from-parent-scope
		$scope.isActive = function (section) {
			return ($location.path() === section);
		};
	}
]);
