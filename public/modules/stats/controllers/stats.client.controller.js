'use strict';

angular.module('stats').controller('StatsController', ['$scope', 'Job',
	function($scope, Job) {
		$scope.stats = Job.getStats({
			cities: true,
			availabilities: true
		});

		$scope.stats.$promise.then(function(statsData) {

		});
	}
]);
