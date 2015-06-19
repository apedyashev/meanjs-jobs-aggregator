'use strict';

angular.module('core').directive('subscriptionsList', ['Subscription', '$state', '$location',
	function(Subscription, $state, $location) {
		return {
			templateUrl: '/modules/core/views/subscriptions-list.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				Subscription.clear();
			 	Subscription.query(function(data){
					 scope.subscriptions = Subscription.getAll();
				});


				scope.removeSubscription = function(subscription) {
					subscription.$remove(function() {
						for (var i in scope.subscriptions) {
							if (scope.subscriptions[i] === subscription) {
								scope.subscriptions.splice(i, 1);
							}
						}
					});
				};

				scope.editSubscription = function($event, subscription) {
					$event.preventDefault();
					$event.stopPropagation();

					console.log('edit', subscription._id);
					//$state.go('dashboard');
					$state.go('dashboard.edit-subscription', {
						subscriptionId: subscription._id
					});
				};

				scope.isItemActive = function(path, subscription) {
					var curPath = path + '/' + subscription._id;
					return ($location.path() === curPath);
				};
			}
		};
	}
]);
