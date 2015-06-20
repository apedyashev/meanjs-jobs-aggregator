'use strict';

angular.module('dashboard').controller('EditSubscriptionController', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		$scope.subscriptionId = $stateParams.subscriptionId;
	}
]);
