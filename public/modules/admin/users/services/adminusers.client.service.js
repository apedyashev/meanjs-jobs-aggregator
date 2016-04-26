'use strict';

//Adminusers service used to communicate Adminusers REST endpoints
angular.module('adminusers').factory('Adminusers', ['$resource',
	function($resource) {
		return $resource('adminusers/:adminuserId', { adminuserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);