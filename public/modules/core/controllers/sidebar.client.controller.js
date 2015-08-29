'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$location',
	function($scope, $location, $route) {
		// (For mobile devices ONLY)
		$scope.toggleMenu = function() {
			$scope.isMenuVisible = !$scope.isMenuVisible;
		};

		// Collapsing the menu after navigation (For mobile devices ONLY)
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isMenuVisible = false;
		});

		//$scope.$on('$stateChangeStart', function(next, current) {
		//	console.log('start');
		//});
		//$scope.$on('$stateChangeSuccess', function() {
		//	console.log('end');
		//});

		$scope.isItemActive = function (section) {
			return ($location.path() === section);
		};
	}
]);
