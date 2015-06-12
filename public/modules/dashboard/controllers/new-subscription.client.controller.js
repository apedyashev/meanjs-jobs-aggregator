'use strict';

angular.module('dashboard').controller('NewSubscriptionController', ['$scope', 'Job', 'Subscription',
	function($scope, Job, Subscription) {

		$scope.init = function() {
			$scope.stats = Job.getStats();
		};

		$scope.selectedCities = {};
		$scope.keywords = [];
		$scope.create = function() {
			var cities = $.map($scope.selectedCities, function(value, key) {
					return key;
				}),
				subscription = new Subscription({
					title: $scope.title,
					cities: cities,
					keywords: $scope.keywords
				});
			subscription.$save(function(response) {
				//$location.path('articles/' + response._id);

				//$scope.title = '';
				//$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			console.log(cities, $scope.selectedCities, $scope.keywords);
		};
	}
]);
