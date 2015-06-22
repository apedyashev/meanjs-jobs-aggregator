'use strict';

angular.module('core').controller('SidebarController', ['$scope',
	function($scope) {
		// Sidebar controller logic
		// ...

		$scope.toggleMenu = function() {
			$scope.isMenuVisible = !$scope.isMenuVisible;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isMenuVisible = false;
		});
	}
]);
