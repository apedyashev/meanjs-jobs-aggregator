'use strict';

angular.module('adminusers').directive('userItem', [
	function() {
		return {
			templateUrl: '/modules/admin/users/views/admin.user-item.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);
