'use strict';

angular.module('core').directive('subscriptionsList', ['Subscription',
	function(Subscription) {
		return {
			templateUrl: '/modules/core/views/subscriptions-list.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.subscriptions = Subscription.query();
				//element.text('this is the subscriptionsList directive');
			}
		};
	}
]);
