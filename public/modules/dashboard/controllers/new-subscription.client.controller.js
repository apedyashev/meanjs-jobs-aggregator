'use strict';

angular.module('dashboard').controller('NewSubscriptionController', ['$scope', 'Job', 'Subscription',
	function($scope, Job, Subscription) {

		$scope.subscription = {
			_id: null,
			title: '',
			selectedCities: {},
			keywords: []
		};

		$scope.init = function() {
			$scope.stats = Job.getStats();
		};

		//$scope.selectedCities = {};
		//$scope.keywords = [];
		$scope.save = function() {
			var cities = $.map($scope.subscription.selectedCities, function(value, key) {
					return key;
				}),
				subscription = new Subscription({
					title: $scope.subscription.title,
					cities: cities,
					keywords: $scope.subscription.keywords
				});
			subscription.$save(function(response) {
				//$location.path('articles/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			//console.log(cities, $scope.selectedCities, $scope.keywords);
		};
	}
]);
