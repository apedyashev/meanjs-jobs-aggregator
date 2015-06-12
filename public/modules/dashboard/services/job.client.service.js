'use strict';

angular.module('dashboard').factory('Job', ['$resource',
	function($resource) {
		return $resource('api/jobs/:jobId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			getStats: {
				method: 'GET',
				url: '/api/jobs/stats'
			}
		});
	}
]);
