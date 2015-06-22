'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'Notification',
	function($resource, Notification) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT',
				interceptor: Notification.interceptor
			}
		});
	}
]);
