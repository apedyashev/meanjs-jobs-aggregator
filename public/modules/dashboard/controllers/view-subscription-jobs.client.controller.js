'use strict';

angular.module('dashboard').controller('ViewSubscriptionJobsController', ['$scope', '$stateParams', 'Job',
	function($scope, $stateParams, Job) {
		$scope.find = function() {
			$scope.jobs = Job.query({
				subscriptionId: $stateParams.subscriptionId
			});
		};
	}
]);
