'use strict';

angular.module('dashboard').factory('Job', ['$resource',
	function($resource) {
		var Job = $resource('api/jobs/:jobId', {
			articleId: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			},
			getStats: {
				method: 'GET',
				url: '/api/jobs/stats'
			}
		});

		var allLoadedJobs = [];
		/**
		 * Loads the next page with jobs
		 */
		Job.loadNextPage = function() {
			var onDone = null,
				subscriptionId = null;
			if (arguments.length === 1) {
				onDone = arguments[0];
			}
			if (arguments.length === 2) {
				subscriptionId = arguments[0];
				onDone = arguments[1];
			}

			var params = {
				offset: allLoadedJobs.length
			};
			if (subscriptionId) {
				params.subscriptionId = subscriptionId;
			}
			Job.query(params, function(jobs) {
				angular.forEach(jobs, function(job) {
					allLoadedJobs.push(job);
				});
				onDone();
			});
		};

		/**
		 * Returns internal array containing all job items
		 */
		Job.getItems = function() {
			return allLoadedJobs;
		};

		/**
		 * Erases internal array
		 */
		Job.clearItems = function() {
			allLoadedJobs = [];
		};

		return Job;
	}
]);
