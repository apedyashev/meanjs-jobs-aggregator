'use strict';

// Adminusers controller
angular.module('adminusers').controller('AdminusersController', ['$scope', '$stateParams', '$location', 'Users',
	function($scope, $stateParams, $location, Users) {
		//$scope.authentication = Authentication;

		// Create new Adminuser
		//$scope.create = function() {
		//	// Create new Adminuser object
		//	var adminuser = new Adminusers ({
		//		name: this.name
		//	});
        //
		//	// Redirect after save
		//	adminuser.$save(function(response) {
		//		$location.path('adminusers/' + response._id);
        //
		//		// Clear form fields
		//		$scope.name = '';
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};

		// Remove existing Adminuser
		//$scope.remove = function(adminuser) {
		//	if ( adminuser ) {
		//		adminuser.$remove();
        //
		//		for (var i in $scope.adminusers) {
		//			if ($scope.adminusers [i] === adminuser) {
		//				$scope.adminusers.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.adminuser.$remove(function() {
		//			$location.path('adminusers');
		//		});
		//	}
		//};
        //
		//// Update existing Adminuser
		//$scope.update = function() {
		//	var adminuser = $scope.adminuser;
        //
		//	adminuser.$update(function() {
		//		$location.path('adminusers/' + adminuser._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};

		// Find a list of Adminusers
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing Adminuser
		$scope.findOne = function() {
			$scope.adminuser = Users.get({
				adminuserId: $stateParams.adminuserId
			});
		};
	}
]);
