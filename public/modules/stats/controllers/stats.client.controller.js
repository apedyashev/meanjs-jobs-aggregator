'use strict';

angular.module('stats').controller('StatsController', ['$scope', 'Job',
	function($scope, Job) {
		$scope.loadInProgress = true;
		Job.getStats({
			cities: true,
			availabilities: true
		}).$promise.then(function(stats) {
			$scope.stats = stats;
			$scope.maxCityCount = 0;
			$scope.totalJobs = 0;
			angular.forEach(stats.cities, function(city) {
				// find city that contains the most amount of jobs (used to calculate percents for progressbar)
				$scope.maxCityCount = (city.count > $scope.maxCityCount) ? city.count : $scope.maxCityCount;
				$scope.totalJobs += city.count;
			});

			$scope.maxAvailCount = 0;
			angular.forEach(stats.availabilities, function(avail) {
				// find item that contains the greatest count (used to calculate percents for progressbar)
				$scope.maxAvailCount = (avail.count > $scope.maxAvailCount) ? avail.count : $scope.maxAvailCount;
			});
			$scope.loadInProgress = false;
		}, function() {
			$scope.loadInProgress = false;
		});
	}
]);
