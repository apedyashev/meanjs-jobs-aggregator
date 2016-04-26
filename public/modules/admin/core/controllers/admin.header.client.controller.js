'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$http',  'Authentication',
	function($scope, $location, $http,  Authentication) {
		if (!Authentication.user || (Authentication.user.roles.indexOf('admin') == -1)) {
			window.location = '/';
		}
	}
]);
