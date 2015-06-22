'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Notification',
	function($scope, $http, $location, Users, Authentication, Notification) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		//$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
		//	for (var i in $scope.user.additionalProvidersData) {
		//		return true;
		//	}
        //
		//	return false;
		//};

		// Check if provider is already in use with current user
		//$scope.isConnectedSocialAccount = function(provider) {
		//	return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		//};

		// Remove a user social account
		//$scope.removeUserSocialAccount = function(provider) {
		//	$scope.success = $scope.error = null;
        //
		//	$http.delete('/api/users/accounts', {
		//		params: {
		//			provider: provider
		//		}
		//	}).success(function(response) {
		//		// If successful show success message and clear form
		//		$scope.success = true;
		//		$scope.user = Authentication.user = response;
		//	}).error(function(response) {
		//		Notification.showError(response.message);
		//	});
		//};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				var user = new Users($scope.user);

				user.$update(function(response) {
					Notification.showSuccess('Profile Saved Successfully');
					Authentication.user = response;
				}, function(response) {
					// error message is displayed from $resources interceptor
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;
				Notification.showSuccess('Password Changed Successfully');
			}).error(function(response) {
				Notification.showError(response.message);
			});
		};
	}
]);
