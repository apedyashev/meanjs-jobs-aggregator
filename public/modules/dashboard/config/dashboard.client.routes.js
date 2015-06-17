'use strict';

//Setting up route
// http://www.funnyant.com/angularjs-ui-router/
angular.module('dashboard').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Dashboard state routing
		$stateProvider.
			state('dashboard', {
				url: '/dashboard',
				views: {
					// syntax: <view-name@state-name>. In this case view name is looking in the application shell
					'dashboard@': {
						templateUrl: 'modules/dashboard/views/_layout.client.view.html'
					},
					// syntax: <view-name@state-name>
					'jobs@dashboard': {
						templateUrl: 'modules/dashboard/views/all-jobs.client.view.html'
					}
				}
			}).
			state('dashboard.new-subscription', {
				url: '/subscription/new',
				views: {
					'content': {
						templateUrl: 'modules/dashboard/views/new-subscription.client.view.html'
					}
				}
			}).
			state('dashboard.edit-subscription', {
				url: '/edit-subscription/:subscriptionId',
				views: {
					'content': {
						templateUrl: 'modules/dashboard/views/edit-subscription.client.view.html'
					}
				}
			}).
			state('dashboard.view-subscription-jobs', {
				url: '/subscription/:subscriptionId',
				views: {
					'content': {
						templateUrl: 'modules/dashboard/views/view-subscription-jobs.client.view.html'
					}
				}
			})
			;
	}
]);
