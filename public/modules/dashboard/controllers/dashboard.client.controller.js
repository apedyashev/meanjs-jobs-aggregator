'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', 'Job',
	function($scope, Job) {

		$scope.find = function() {
			$scope.jobs = Job.query();
		};
	}
]);
