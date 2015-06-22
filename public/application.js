'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
	function($locationProvider, $httpProvider) {
		// use the HTML5 History API
		// more info here: https://scotch.io/quick-tips/pretty-urls-in-angularjs-removing-the-hashtag
		$locationProvider.html5Mode(true);

		// make backend-checking of 'req.xhr' working for ajax requests
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
