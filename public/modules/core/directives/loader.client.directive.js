'use strict';

angular.module('core').directive('loader', [
	function() {
		return {
			templateUrl: '/modules/core/views/loader.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);
