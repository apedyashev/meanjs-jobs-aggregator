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

				// display keywords in the tabinput
				if (scope.keywords) {
					$.each(scope.keywords, function(index, keyword) {
						$(element).tagsinput('add', keyword);
					});
				}
				//pass added keywords from widget to scope's variable
				$(element).on('itemAdded', function(event) {
					scope.keywords.push(event.item);
				});
			}
		};
	}
]);
