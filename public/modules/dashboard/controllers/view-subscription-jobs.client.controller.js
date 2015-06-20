'use strict';

angular.module('dashboard').controller('ViewSubscriptionJobsController', ['$scope', '$stateParams', 'Job',
	function($scope, $stateParams, Job) {
		/**
		 * Clears internal jobs array when page before page show
		 */
		$scope.init = function() {
			Job.clearItems();
		};

		$scope.loadInProgress = false;
		/**
		 * Loads the next page with jobs
		 */
		$scope.loadMoreJobs = function() {
			if ($scope.loadInProgress) {
				return;
			}

			$scope.loadInProgress = true;
			Job.loadNextPage($stateParams.subscriptionId, function(err) {
				if (err) {
					$scope.loadingError = true;
				}
				else {
					$scope.loadingError = false;
					$scope.jobs = Job.getItems();
				}
				$scope.loadInProgress = false;
			});
		};
	}
]);
