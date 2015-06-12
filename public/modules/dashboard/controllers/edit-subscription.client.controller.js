'use strict';

angular.module('dashboard').controller('EditSubscriptionController', ['$scope', '$stateParams', 'Job', 'Subscription',
	function($scope, $stateParams, Job, Subscription) {
		//var subscriptionId = null;

		$scope.subscription = {
			_id: null,
			title: '',
			selectedCities: {},
			keywords: []
		};

		$scope.init = function() {
			$scope.stats = Job.getStats();

			Subscription.get({
				id: $stateParams.subscriptionId
			}).$promise.then(function(subscription) {
				$scope.subscription._id 	= subscription._id;
				$scope.subscription.title 	= subscription.title;
				$scope.subscription.keywords = subscription.keywords;

				$.each(subscription.cities, function(index, city) {
					$scope.subscription.selectedCities[city] = true;
				});
			});
		};


		$scope.save = function() {
			var cities = $.map($scope.subscription.selectedCities, function(value, key) {
					return key;
				}),
				subscription = new Subscription({
					_id: $scope.subscription._id,
					title: $scope.subscription.title,
					cities: cities,
					keywords: $scope.subscription.keywords
				});
			subscription.$update(function(response) {
				//$location.path('articles/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			console.log($scope.subscription.keywords);
		};
	}
]);
