'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', 'Job',
	function($scope, Job) {
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
			Job.loadNextPage(function() {
				$scope.jobs = Job.getItems();
				$scope.loadInProgress = false;
			});
		};
	}
]);
