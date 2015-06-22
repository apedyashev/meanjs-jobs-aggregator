'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'jobs-aggregator';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'angular-confirm', 'infinite-scroll', 'ui.gravatar'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

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

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dashboard');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('stats');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$http', 'Authentication', 'Menus', 'Notification',
	function($scope, $location, $http, Authentication, Menus, Notification) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.isMenuActive = function (section) {
			var re = new RegExp('^' + section);
			return re.test($location.path());
		};

		$scope.isSigningOut = false;
		$scope.signOut = function() {
			$scope.isSigningOut = true;
			$http.delete('/api/auth')
				.success(function() {
					$scope.isSigningOut = false;
					Notification.showSuccess('Signed out');
					$scope.authentication.user = null;
					$location.path('/');
				})
				.error(function(response) {
					$scope.isSigningOut = false;
					var message = (response.data && response.data.message) ? response.data.message : response.message;
					Notification.showError(message || 'Unknown error');
				});
		};

	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core').controller('SidebarController', ['$scope',
	function($scope) {
		// Sidebar controller logic
		// ...

		$scope.toggleMenu = function() {
			$scope.isMenuVisible = !$scope.isMenuVisible;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isMenuVisible = false;
		});
	}
]);

'use strict';

angular.module('core').directive('loader', [
	function() {
		return {
			templateUrl: '/modules/core/views/loader.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);

'use strict';

angular.module('core').directive('subscriptionsList', ['Subscription', '$state', '$location',
	function(Subscription, $state, $location) {
		return {
			templateUrl: '/modules/core/views/subscriptions-list.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				Subscription.clear();
				scope.loadInProgress = true;
			 	Subscription.query(function(data){
					scope.loadInProgress = false;
					scope.subscriptions = Subscription.getAll();
				});


				scope.removeSubscription = function(subscription) {
					subscription.$remove(function() {
						for (var i in scope.subscriptions) {
							if (scope.subscriptions[i] === subscription) {
								scope.subscriptions.splice(i, 1);
							}
						}
					});
				};

				scope.editSubscription = function($event, subscription) {
					$event.preventDefault();
					$event.stopPropagation();

					$state.go('dashboard.edit-subscription', {
						subscriptionId: subscription._id
					});
				};

				scope.isItemActive = function(path, subscription) {
					var curPath = path + '/' + subscription._id;
					return ($location.path() === curPath);
				};
			}
		};
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
					console.log(response);
					showError(message || (response.status + ' ' + response.statusText));

					var deferred = $q.defer();
					deferred.reject(response);
					return deferred.promise;
				}
			}
		};
	}
]);

'use strict';

//Setting up route
// http://www.funnyant.com/angularjs-ui-router/
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboard state routing
		$stateProvider.
			state('dashboard', {
				url: '/dashboard',
				views: {
					// syntax: <view-name@state-name>. In this case view name is looking in the application shell
					'dashboard@': {
						templateUrl: 'modules/dashboard/views/_layout.client.view.html'
					},
					// syntax: <view-name@state-name>
					'jobs@dashboard': {
						templateUrl: 'modules/dashboard/views/all-jobs.client.view.html'
					}
				}
			}).
			state('dashboard.new-subscription', {
				url: '/subscription/new',
				views: {
					'content': {
						templateUrl: 'modules/dashboard/views/new-subscription.client.view.html'
					},
					'jobs@dashboard': {
						template: ''
					}
				}
			}).
			state('dashboard.edit-subscription', {
				url: '/edit-subscription/:subscriptionId',
				views: {
					'content': {
						templateUrl: 'modules/dashboard/views/edit-subscription.client.view.html'
					},
					'jobs@dashboard': {
						template: ''
					}
				}
			}).
			state('dashboard.view-subscription-jobs', {
				url: '/subscription/:subscriptionId',
				views: {
					'content': {
						template: ''
					},
					'jobs@dashboard': {
						templateUrl: 'modules/dashboard/views/view-subscription-jobs.client.view.html'
					}
				}
			})
			;
	}
]);

'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', 'Job',
	function($scope, Job) {
	}
]);

'use strict';

angular.module('dashboard').controller('EditSubscriptionController', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		$scope.subscriptionId = $stateParams.subscriptionId;
	}
]);

'use strict';

angular.module('dashboard').controller('NewSubscriptionController', ['$scope',
	function($scope) {
	}
]);

'use strict';

angular.module('dashboard').controller('ViewSubscriptionJobsController', ['$scope', '$stateParams', 'Job',
	function($scope, $stateParams, Job) {
		$scope.subscriptionId = $stateParams.subscriptionId;
	}
]);

'use strict';

angular.module('dashboard').directive('editSubscriptionForm', ['$location', 'Job', 'Subscription',
	function($location,  Job, Subscription) {
		return {
			templateUrl: '/modules/dashboard/views/edit-subscription-form.client.view.html',
			restrict: 'E',
			scope: {
				subscriptionId: '='
			},
			link: function postLink(scope, element, attrs) {
				scope.search = {
					city: ''
				};
				scope.subscription = {
					_id: null,
					title: '',
					selectedCities: {},
					keywords: []
				};

				/**
				 * Updates existing or creates a new subscription
				 */
				scope.save = function() {
					var cities = [],
						subscription = new Subscription({
							title: scope.subscription.title,
							cities: cities,
							keywords: scope.subscription.keywords
						});

					$.each(scope.subscription.selectedCities, function(key, value) {
						if (value) {
							cities.push(key);
						}
					});

					// update existing subscription
					if (scope.subscriptionId) {
						subscription._id = scope.subscriptionId;
						subscription.$update(function(response) {
							//$location.path('articles/' + response._id);
						}, function(errorResponse) {
							scope.error = errorResponse.data.message;
						});
					}
					// create a new subscription
					else {
						subscription.$save(function(response) {
							$location.path('dashboard/subscription/' + response._id);
						}, function(errorResponse) {
							scope.error = errorResponse.data.message;
						});
					}
				};

				// Directive initialization
				scope.loadInProgress = true;
				Job.getStats({
					cities: true
				}).$promise.then(function(stats) {
					scope.stats = stats;
					scope.loadInProgress = false;
				}, function() {
					scope.loadInProgress = false;
				});

				// if existing subscription is being edited then load it from the server
				if (scope.subscriptionId) {
					Subscription.get({
						id: scope.subscriptionId
					}).$promise.then(function(subscription) {
						scope.subscription._id 		= subscription._id;
						scope.subscription.title 	= subscription.title;
						scope.subscription.keywords	= subscription.keywords;

						$.each(subscription.cities, function(index, city) {
							scope.subscription.selectedCities[city] = true;
						});
					});
				}
			}
		};
	}
]);

'use strict';

angular.module('dashboard').directive('jobItem', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/job-item.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);

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

'use strict';

angular.module('dashboard').directive('keywordsTabinput', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/keywords-tabinput.client.view.html',
			restrict: 'E',
			scope: {
				keywords: '='
			},
			link: function postLink(scope, element, attrs) {
				var input = $(element).find('input');
				input.tagsinput();

				// the link() function is being called, scope.keywords = [] so we need to wait when AJAX response
				// is received and scope.keywords is initialized
				scope.$watch(function() {
					return scope.keywords;
				}, function() {
					// display keywords in the tabinput
					if (scope.keywords) {
						$.each(scope.keywords, function(index, keyword) {
							input.tagsinput('add', keyword);
						});
					}
				});

				//pass added keywords from widget to scope's variable
				input.on('itemAdded', function(event) {
					scope.keywords.push(event.item);
				});
				input.on('itemRemoved', function(event) {
					// call $apply because scope's variable is updated outside of angular (in widget's callback)
					scope.$apply(function() {
						scope.keywords = $.grep(scope.keywords, function(keyword) {
							return (keyword !== event.item);
						});
					});

				});
			}
		};
	}
]);

'use strict';

angular.module('dashboard').directive('searchInput', [
	function() {
		return {
			templateUrl: '/modules/dashboard/views/search-input.client.view.html',
			restrict: 'E',
			scope: {
				value: '='
			},
			link: function postLink(scope, element, attrs) {
				$(element).find('input').keydown(function(event) {
					// do not sumbit entire form on enter press
					if(event.keyCode === 13) {
						event.preventDefault();
						return false;
					}
				}).focus(function() {
					$(this).closest('.form-group').width('100%');
				}).focusout(function() {
					$(this).closest('.form-group').width('');
				});
			}
		};
	}
]);

'use strict';

angular.module('dashboard').factory('Job', ['$resource', 'Notification',
	function($resource, Notification) {
		var Job = $resource('/api/jobs/:jobId', {
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
				onDone(null, jobs);
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

'use strict';

angular.module('dashboard').factory('Subscription', ['$resource', 'Notification',
	function($resource, Notification) {
		var Subscription =  $resource('/api/subscriptions/:id', {
			id: '@_id'
		}, {
			query: {
				isArray: true,
				// initialize internal subscriptionsList array when list of subscriptions is pulled
				transformResponse: function(data) {
					//subscriptionsList = angular.fromJson(data);
					angular.forEach(angular.fromJson(data), function(item) {
						subscriptionsList.push(new Subscription(item));
					});
					return subscriptionsList;
				},
				interceptor: Notification.interceptor
			},
			get: {
				interceptor: Notification.interceptor
			},
			save: {
				method: 'POST',
				isArray: false,
				// append created subscription into internal array
				transformResponse: function(data) {
					var dataObject = angular.fromJson(data),
						subscriptionObject = new Subscription(dataObject);
					subscriptionsList.push(subscriptionObject);
					return angular.fromJson(data);
				},
				interceptor: Notification.interceptor
			},
			update: {
				method: 'PUT',
				// update subscription's data in internal array
				transformResponse: function(data) {
					var dataObject = angular.fromJson(data),
						subscriptionObject = new Subscription(dataObject);
					// it seems angular's forEach returns copies of items instead of references in iterator
					// so regular for is used
					for (var i = 0; i < subscriptionsList.length; i++) {
						if (subscriptionsList[i]._id === dataObject._id) {
							subscriptionsList[i] = new Subscription(dataObject);
						}
					}

					return subscriptionObject;
				},
				interceptor: Notification.interceptor
			},
			remove: {
				method: 'DELETE',
				interceptor: Notification.interceptor
			}
		});

		var subscriptionsList = [];
		Subscription.getAll = function() {
			return subscriptionsList;
		};

		Subscription.clear = function() {
			subscriptionsList = [];
		};


		return Subscription;
	}
]);

'use strict';

//Setting up route
angular.module('stats').config(['$stateProvider',
	function($stateProvider) {
		// Stats state routing
		$stateProvider.
		state('stats', {
			url: '/statistics',
			templateUrl: 'modules/stats/views/stats.client.view.html'
		});
	}
]);
'use strict';

angular.module('stats').controller('StatsController', ['$scope', 'Job',
	function($scope, Job) {
		$scope.loadInProgress = true;
		Job.getStats({
			cities: true,
			availabilities: true
		}).$promise.then(function(stats) {
			$scope.stats = stats;
			$scope.maxCityCount = 0;
			angular.forEach(stats.cities, function(city) {
				$scope.maxCityCount = (city.count > $scope.maxCityCount) ? city.count : $scope.maxCityCount;
			});

			$scope.maxAvailCount = 0;
			angular.forEach(stats.availabilities, function(avail) {
				$scope.maxAvailCount = (avail.count > $scope.maxAvailCount) ? avail.count : $scope.maxAvailCount;
			});
			$scope.loadInProgress = false;
		}, function() {
			$scope.loadInProgress = false;
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Notification',
	function($scope, $http, $location, Authentication, Notification) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) {
			$location.path('/dashboard');
		}

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				Notification.showError(response.message);
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				Notification.showError(response.message);
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Notification',
	function($scope, $http, $location, Users, Authentication, Notification) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		//$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
		//	for (var i in $scope.user.additionalProvidersData) {
		//		return true;
		//	}
        //
		//	return false;
		//};

		// Check if provider is already in use with current user
		//$scope.isConnectedSocialAccount = function(provider) {
		//	return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		//};

		// Remove a user social account
		//$scope.removeUserSocialAccount = function(provider) {
		//	$scope.success = $scope.error = null;
        //
		//	$http.delete('/api/users/accounts', {
		//		params: {
		//			provider: provider
		//		}
		//	}).success(function(response) {
		//		// If successful show success message and clear form
		//		$scope.success = true;
		//		$scope.user = Authentication.user = response;
		//	}).error(function(response) {
		//		Notification.showError(response.message);
		//	});
		//};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				var user = new Users($scope.user);

				user.$update(function(response) {
					Notification.showSuccess('Profile Saved Successfully');
					Authentication.user = response;
				}, function(response) {
					// error message is displayed from $resources interceptor
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;
				Notification.showSuccess('Password Changed Successfully');
			}).error(function(response) {
				Notification.showError(response.message);
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'Notification',
	function($resource, Notification) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT',
				interceptor: Notification.interceptor
			}
		});
	}
]);
