'use strict';

angular.module('dashboard').controller('NewSubscriptionController', ['$scope', '$location', 'Job', 'Subscription',
	function($scope, $location,  Job, Subscription) {

		$scope.search = {
			city: ''
		};
		$scope.subscription = {
			_id: null,
			title: '',
			selectedCities: {},
			keywords: []
		};

		$scope.init = function() {
			$scope.loadInProgress = true;
			Job.getStats({
				cities: true
			}).$promise.then(function(stats) {
				$scope.stats = stats;
				$scope.loadInProgress = false;
			}, function() {
				$scope.loadInProgress = false;
			});
		};

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
				$location.path('dashboard/subscription/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
