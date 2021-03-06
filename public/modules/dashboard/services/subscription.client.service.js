'use strict';

angular.module('dashboard').factory('Subscription', ['$resource', 'Notification',
	function($resource, Notification) {
		var Subscription =  $resource('/api/subscriptions/:id', {
			id: '@_id'
		}, {
			query: {
				isArray: true,
				// initialize internal subscriptionsList array when list of subscriptions is pulled
				transformResponse: function(data) {
					//subscriptionsList = angular.fromJson(data);
					angular.forEach(angular.fromJson(data), function(item) {
						subscriptionsList.push(new Subscription(item));
					});
					return subscriptionsList;
				},
				interceptor: Notification.interceptor
			},
			get: {
				interceptor: Notification.interceptor
			},
			save: {
				method: 'POST',
				isArray: false,
				// append created subscription into internal array
				transformResponse: function(data) {
					var dataObject = angular.fromJson(data),
						subscriptionObject = new Subscription(dataObject);
					subscriptionsList.push(subscriptionObject);
					return angular.fromJson(data);
				},
				interceptor: Notification.interceptor
			},
			update: {
				method: 'PUT',
				// update subscription's data in internal array
				transformResponse: function(data) {
					var dataObject = angular.fromJson(data),
						subscriptionObject = new Subscription(dataObject);
					// it seems angular's forEach returns copies of items instead of references in iterator
					// so regular for is used
					for (var i = 0; i < subscriptionsList.length; i++) {
						if (subscriptionsList[i]._id === dataObject._id) {
							subscriptionsList[i] = new Subscription(dataObject);
						}
					}

					return subscriptionObject;
				},
				interceptor: Notification.interceptor
			},
			remove: {
				method: 'DELETE',
				interceptor: Notification.interceptor
			}
		});

		var subscriptionsList = [];
		Subscription.getAll = function() {
			return subscriptionsList;
		};

		Subscription.clear = function() {
			subscriptionsList = [];
		};


		return Subscription;
	}
]);
