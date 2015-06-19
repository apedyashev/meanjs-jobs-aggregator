'use strict';

angular.module('stats').controller('StatsController', ['$scope', 'Job',
	function($scope, Job) {
		$scope.loadInProgress = true;
		Job.getStats({
			cities: true,
			availabilities: true
		}).$promise.then(function(stats) {
			$scope.stats = stats;
			$scope.loadInProgress = false;
		}, function() {
			$scope.loadInProgress = false;
		});
	}
]);
