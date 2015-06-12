'use strict';

angular.module('dashboard').factory('Subscription', ['$resource',
	function($resource) {
		return $resource('api/subscriptions/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}//,
			//findOne
		});
	}
]);
