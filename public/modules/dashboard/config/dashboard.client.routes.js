'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboard state routing
		$stateProvider.
		state('new-subscription', {
			url: '/dashboard/subscription/new',
			templateUrl: 'modules/dashboard/views/new-subscription.client.view.html'
		}).
		state('view-subscription-jobs', {
			url: '/dashboard/subscription/:subscriptionId',
			templateUrl: 'modules/dashboard/views/view-subscription-jobs.client.view.html'
		}).
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
		});
	}
]);
