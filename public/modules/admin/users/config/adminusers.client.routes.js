'use strict';

//Setting up route
angular.module('adminusers').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
			state('listAdminusers', {
				url: '/admin/users',
				templateUrl: 'modules/admin/users/views/admin.users-page.client.view.html'
			});
	}
]);
