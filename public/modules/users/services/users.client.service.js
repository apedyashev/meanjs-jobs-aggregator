'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'Notification',
	function($resource, Notification) {
		var User = $resource('api/users/:id', {
			id: '@_id'
		}, {
			get: {
				interceptor: Notification.interceptor
			},
			update: {
				method: 'PUT',
				interceptor: Notification.interceptor
			}
		});

		var allLoadedItems = [],
			limit = 20;
		/**
		 * Loads the next page with users
		 */
		User.loadNextPage = function() {
			var onDone = null,
				subscriptionId = null;
			if (arguments.length === 1) {
				onDone = arguments[0];
			}
			if (arguments.length === 2) {
				subscriptionId = arguments[0];
				onDone = arguments[1];
			}

			var params = {
				offset: allLoadedItems.length,
				limit: limit
			};
			if (subscriptionId) {
				params.subscriptionId = subscriptionId;
			}

			User.query(params).$promise.then(function(items) {
				angular.forEach(items, function(item) {
					allLoadedItems.push(item);
				});
				onDone(null, items);
			}, function(error) {
				onDone(error);
			});
		};

		/**
		 * Returns internal array containing all user items
		 */
		User.getItems = function() {
			return allLoadedItems;
		};

		/**
		 * Erases internal array
		 */
		User.clearItems = function() {
			allLoadedItems = [];
		};

		/**
		 * Returns a value of limit parameter for GET request
		 * @returns {number}
		 */
		User.getLimitValue = function() {
			return limit;
		};

		return User;
	}
]);
