'use strict';

angular.module('dashboard').directive('jobItem', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/job-item.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);
