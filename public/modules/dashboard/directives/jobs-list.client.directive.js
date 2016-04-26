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


				/**
				 * Loads the next page with jobs
				 */
				var retriesCount = 0;
				scope.loadInProgress = false;
				scope.retriesCountExceeded = false;
				scope.loadMoreJobs = function() {
					if (scope.loadInProgress) {
						return;
					}

					var onPageLoaded = function(err, currentJobs) {
						if (err) {
							scope.loadingError = true;
						}
						else {
							scope.loadingError = false;
							scope.jobs = Job.getItems();
						}
						scope.loadInProgress = false;

						// prevent request resending if empty array is received
						if (err || !currentJobs || !currentJobs.length) {
							retriesCount++;
							if (retriesCount > 10) {
								scope.retriesCountExceeded = true;
							}
						}
					};

					scope.loadInProgress = true;
					// TODO: WTF???
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
