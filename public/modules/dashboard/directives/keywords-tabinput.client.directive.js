'use strict';

angular.module('dashboard').directive('keywordsTabinput', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/keywords-tabinput.client.view.html',
			restrict: 'E',
			scope: {
				keywords: '='
			},
			link: function postLink(scope, element, attrs) {
				$(element).tagsinput();
				$(element).on('itemAdded', function(event) {
					console.log(event.item);
					scope.keywords.push(event.item);
				});
			}
		};
	}
]);
