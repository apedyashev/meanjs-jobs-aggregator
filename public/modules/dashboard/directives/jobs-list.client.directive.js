'use strict';

angular.module('dashboard').directive('jobsList', ['$stateParams', 'Job',
	function($stateParams, Job) {
		return {
			templateUrl: '/modules/dashboard/views/jobs-list.client.view.html',
			restrict: 'E',
			scope: {
				subscriptionId: '='
			},
			link: function postLink(scope, element, attrs) {
				// Clears internal jobs array when page before page show
				Job.clearItems();

				scope.loadInProgress = false;
				/**
				 * Loads the next page with jobs
				 */
				scope.loadMoreJobs = function() {
					if (scope.loadInProgress) {
						return;
					}

					var onPageLoaded = function(err) {
						if (err) {
							scope.loadingError = true;
						}
						else {
							scope.loadingError = false;
							scope.jobs = Job.getItems();
						}
						scope.loadInProgress = false;
					};

					scope.loadInProgress = true;
					if (scope.subscriptionId) {
						Job.loadNextPage($stateParams.subscriptionId, onPageLoaded);
					}
					else {
						Job.loadNextPage($stateParams.subscriptionId, onPageLoaded);
					}
				};
			}
		};
	}
]);
