'use strict';

// Adminusers controller
angular.module('adminusers').controller('AdminusersController', ['$scope', '$stateParams', '$location', 'Users',
	function($scope, $stateParams, $location, Users) {
		//$scope.authentication = Authentication;

		// Find a list of Adminusers
		$scope.find = function() {
			$scope.users = Users.query();
		};
	}
]);
