'use strict';

angular.module('dashboard').controller('ViewSubscriptionJobsController', ['$scope', '$stateParams', 'Job',
	function($scope, $stateParams, Job) {
		$scope.subscriptionId = $stateParams.subscriptionId;
	}
]);
