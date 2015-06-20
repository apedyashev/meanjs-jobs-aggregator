'use strict';

angular.module('dashboard').directive('searchInput', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/search-input.client.view.html',
			restrict: 'E',
			scope: {
				value: '='
			},
			link: function postLink(scope, element, attrs) {
				$(element).find('input').keydown(function(event) {
					// do not sumbit entire form on enter press
					if(event.keyCode === 13) {
						event.preventDefault();
						return false;
					}
				}).focus(function() {
					$(this).closest('.form-group').width('100%');
				}).focusout(function() {
					$(this).closest('.form-group').width('');
				});
			}
		};
	}
]);
