'use strict';

angular.module('core').directive('butterBar', [
	function() {
		return {
			templateUrl: '/modules/core/views/butter-bar.client.view.html',
			restrict: 'E',
			scope: true,
			link: function postLink(scope, element, attrs) {
				scope.inProgress = false;
				scope.$on('$stateChangeStart', function(next, current) {
					scope.inProgress = true;
				});
				scope.$on('$stateChangeSuccess', function() {
					scope.inProgress = false;
				});
			}
		};
	}
]);
