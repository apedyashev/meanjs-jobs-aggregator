'use strict';

angular.module('dashboard').directive('editSubscriptionForm', ['$location', 'Job', 'Subscription',
	function($location,  Job, Subscription) {
		return {
			templateUrl: '/modules/dashboard/views/edit-subscription-form.client.view.html',
			restrict: 'E',
			scope: {
				subscriptionId: '='
			},
			link: function postLink(scope, element, attrs) {
				scope.search = {
					city: ''
				};
				scope.subscription = {
					_id: null,
					title: '',
					selectedCities: {},
					keywords: []
				};

				/**
				 * Updates existing or creates a new subscription
				 */
				scope.save = function() {
					var cities = $.map(scope.subscription.selectedCities, function(value, key) {
							return key;
						}),
						subscription = new Subscription({
							title: scope.subscription.title,
							cities: cities,
							keywords: scope.subscription.keywords
						});

					// update existing subscription
					if (scope.subscriptionId) {
						subscription._id = scope.subscriptionId;
						subscription.$update(function(response) {
							//$location.path('articles/' + response._id);
						}, function(errorResponse) {
							scope.error = errorResponse.data.message;
						});
					}
					// create a new subscription
					else {
						subscription.$save(function(response) {
							$location.path('dashboard/subscription/' + response._id);
						}, function(errorResponse) {
							scope.error = errorResponse.data.message;
						});
					}
				};

				// Directive initialization
				scope.loadInProgress = true;
				Job.getStats({
					cities: true
				}).$promise.then(function(stats) {
					scope.stats = stats;
					scope.loadInProgress = false;
				}, function() {
					scope.loadInProgress = false;
				});

				// if existing subscription is being edited then load it from the server
				if (scope.subscriptionId) {
					Subscription.get({
						id: scope.subscriptionId
					}).$promise.then(function(subscription) {
						scope.subscription._id 		= subscription._id;
						scope.subscription.title 	= subscription.title;
						scope.subscription.keywords	= subscription.keywords;

						$.each(subscription.cities, function(index, city) {
							scope.subscription.selectedCities[city] = true;
						});
					});
				}
			}
		};
	}
]);