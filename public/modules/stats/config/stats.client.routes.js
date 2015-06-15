'use strict';

//Setting up route
angular.module('stats').config(['$stateProvider',
	function($stateProvider) {
		// Stats state routing
		$stateProvider.
		state('stats', {
			url: '/statistics',
			templateUrl: 'modules/stats/views/stats.client.view.html'
		});
	}
]);