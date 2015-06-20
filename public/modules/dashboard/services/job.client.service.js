'use strict';

angular.module('dashboard').factory('Job', ['$resource', 'Notification',
	function($resource, Notification) {
		var Job = $resource('api/jobs/:jobId', {
			articleId: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true,
				interceptor: Notification.interceptor
			},
			update: {
				method: 'PUT',
				interceptor: Notification.interceptor
			},
			getStats: {
				method: 'GET',
				url: '/api/jobs/stats',
				interceptor: Notification.interceptor
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

			Job.query(params).$promise.then(function(jobs) {
				angular.forEach(jobs, function(job) {
					allLoadedJobs.push(job);
				});
				onDone();
			}, function(error) {
				onDone(error);
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
