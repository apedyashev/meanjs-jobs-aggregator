'use strict';

angular.module('core').directive('butterBar', [
	function() {
		return {
			templateUrl: '/modules/core/views/butter-bar.client.view.html',
			restrict: 'E',
			// create a new scope by inheriting parent scope
			scope: true,
			// Directives that want to modify the DOM typically use the
			// link option to register DOM listeners as well as update the DOM.
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
