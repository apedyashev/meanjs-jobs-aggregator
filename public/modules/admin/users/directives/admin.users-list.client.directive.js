'use strict';

angular.module('adminusers').directive('usersList', ['$stateParams', 'Users',
	function($stateParams, User) {
		return {
			templateUrl: '/modules/admin/users/views/admin.users-list.client.view.html',
			restrict: 'E',
			//scope: {
			//	subscriptionId: '='
			//},
			link: function postLink(scope, element, attrs) {
				// Clears internal users array when page before page show
				User.clearItems();


				/**
				 * Loads the next page with users
				 */
				var retriesCount = 0;
				scope.loadInProgress = false;
				scope.retriesCountExceeded = false;
				scope.loadMoreItems = function() {
					if (scope.loadInProgress) {
						return;
					}

					var onPageLoaded = function(err, currentItems) {
						if (err) {
							scope.loadingError = true;
						}
						else {
							scope.loadingError = false;
							scope.users = User.getItems();
						}
						scope.loadInProgress = false;

						// prevent request resending if empty array is received
						if (err || !currentItems || !currentItems.length) {
							retriesCount++;
							if (retriesCount > 10) {
								scope.retriesCountExceeded = true;
							}
						}
						// received less items than expected - no more items in database
						else if (currentItems.length < User.getLimitValue()) {
							scope.retriesCountExceeded = true;
						}
					};

					scope.loadInProgress = true;
					User.loadNextPage($stateParams.subscriptionId, onPageLoaded);
				};
			}
		};
	}
]);
