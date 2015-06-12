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

				// the link() function is being called, scope.keywords = [] so we need to wait when AJAX response
				// is received and scope.keywords is initialized
				scope.$watch(function() {
					return scope.keywords;
				}, function() {
					// display keywords in the tabinput
					if (scope.keywords) {
						$.each(scope.keywords, function(index, keyword) {
							$(element).tagsinput('add', keyword);
						});
					}
				});

				//pass added keywords from widget to scope's variable
				$(element).on('itemAdded', function(event) {
					scope.keywords.push(event.item);
				});
				$(element).on('itemRemoved', function(event) {
					// call $apply because scope's variable is updated outside of angular (in widget's callback)
					scope.$apply(function() {
						scope.keywords = $.grep(scope.keywords, function(keyword) {
							return (keyword !== event.item);
						});
					});

				});
			}
		};
	}
]);
