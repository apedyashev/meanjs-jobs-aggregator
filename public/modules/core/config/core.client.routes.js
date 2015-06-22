'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
			//views: {
			//	// syntax: <view-name@state-name>. In this case view name is looking in the application shell
			//	'banner@': {
			//		templateUrl: 'modules/core/views/home.client.view.html'
			//	}
			//}
		});
	}
]);
