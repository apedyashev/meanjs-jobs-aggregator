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
			angular.forEach(stats.cities, function(city) {
				$scope.maxCityCount = (city.count > $scope.maxCityCount) ? city.count : $scope.maxCityCount;
			});

			$scope.maxAvailCount = 0;
			angular.forEach(stats.availabilities, function(avail) {
				$scope.maxAvailCount = (avail.count > $scope.maxAvailCount) ? avail.count : $scope.maxAvailCount;
			});
			$scope.loadInProgress = false;
		}, function() {
			$scope.loadInProgress = false;
		});
	}
]);
