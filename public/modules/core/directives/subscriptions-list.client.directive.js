'use strict';

angular.module('core').directive('subscriptionsList', ['Subscription',
	function(Subscription) {
		return {
			templateUrl: '/modules/core/views/subscriptions-list.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.subscriptions = Subscription.query();

				
				scope.removeSubscription = function(subscription) {
					subscription.$remove(function() {
						for (var i in scope.subscriptions) {
							if (scope.subscriptions[i] === subscription) {
								scope.subscriptions.splice(i, 1);
							}
						}
					});
				};
			}
		};
	}
]);
