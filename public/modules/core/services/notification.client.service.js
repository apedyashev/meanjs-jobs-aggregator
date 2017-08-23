'use strict';

/**
 * This jQuery's growl plugin is used http://ksylvest.github.io/jquery-growl/
 */
angular.module('core').factory('Notification', [ '$q',
	function($q) {
		function showError() {
			var title, message;
			if (arguments.length === 2) {
				title = arguments[0];
				message = arguments[1];
			}
			if (arguments.length === 1) {
				title = 'Error';
				message = arguments[0];
			}
			$.growl.error({ title: title, message: message });
		}

		function showSuccess() {
			var title, message;
			if (arguments.length === 2) {
				title = arguments[0];
				message = arguments[1];
			}
			if (arguments.length === 1) {
				title = 'Done';
				message = arguments[0];
			}
			$.growl.notice({ title: title, message: message });
		}

		function showNotice() {
			var title, message;
			if (arguments.length === 2) {
				title = arguments[0];
				message = arguments[1];
			}
			if (arguments.length === 1) {
				title = 'Notice';
				message = arguments[0];
			}
			$.growl({ title: title, message: message });
		}

		function showWarning() {
			var title, message;
			if (arguments.length === 2) {
				title = arguments[0];
				message = arguments[1];
			}
			if (arguments.length === 1) {
				title = 'Warning';
				message = arguments[0];
			}
			$.growl.warning({ title: title, message: message });
		}

		// Public API
		return {
			showError: showError,
			showSuccess: showSuccess,
			showNotice: showNotice,
			showWarning: showWarning,
			interceptor: {
				responseError: function (response) {
					var message = (response.data && response.data.message) ? response.data.message : response.message;
					showError(message || (response.status + ' ' + response.statusText));

					var deferred = $q.defer();
					deferred.reject(response);
					return deferred.promise;
				}
			}
		};
	}
]);
