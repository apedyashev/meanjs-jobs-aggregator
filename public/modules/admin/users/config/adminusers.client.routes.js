'use strict';

//Setting up route
angular.module('adminusers').config(['$stateProvider',
	function($stateProvider) {
		// Adminusers state routing
		$stateProvider.
		state('listAdminusers', {
			url: '/admin/users',
			templateUrl: 'modules/admin/users/views/list-adminusers.client.view.html'
		}).
		state('createAdminuser', {
			url: '/admin/users/create',
			templateUrl: 'modules/adminusers/views/create-adminuser.client.view.html'
		}).
		state('viewAdminuser', {
			url: '/admin/users/:adminuserId',
			templateUrl: 'modules/adminusers/views/view-adminuser.client.view.html'
		}).
		state('editAdminuser', {
			url: '/admin/users/:adminuserId/edit',
			templateUrl: 'modules/adminusers/views/edit-adminuser.client.view.html'
		});
	}
]);
