'use strict';

module.exports = {
	app: {
		title: 'Jobs Aggregator',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		frontEnd: {
			lib: {
				css: [
					'public/lib/bootstrap/dist/css/bootstrap.css',
					'public/lib/font-awesome/css/font-awesome.css',
					'public/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
					'public/lib/growl/stylesheets/jquery.growl.css'
				],
				js: [
					'public/lib/angular/angular.js',
					'public/lib/angular-resource/angular-resource.js',
					//'public/lib/angular-cookies/angular-cookies.js',
					//'public/lib/angular-animate/angular-animate.js',
					//'public/lib/angular-touch/angular-touch.js',
					'public/lib/angular-sanitize/angular-sanitize.js',
					'public/lib/angular-ui-router/release/angular-ui-router.js',
					//'public/lib/angular-ui-utils/ui-utils.js',
					'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
					'public/lib/jquery/dist/jquery.js',
					'public/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
					'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',
					'public/lib/growl/javascripts/jquery.growl.js',
					'public/lib/angular-confirm/angular-confirm.js',
					'public/lib/angular-gravatar/build/angular-gravatar.js'
				]
			},
			css: [
				'public/modules/**/css/*.css'
			],
			js: [
				'public/config.js',
				'public/application.js',
				'public/modules/*/*.js',
				'public/modules/*/*[!tests]*/*.js'
			],
			tests: [
				'public/lib/angular-mocks/angular-mocks.js',
				'public/modules/*/tests/*.js'
			]
		},
		admin: {
			lib: {
				css: [
					'public/lib/bootstrap/dist/css/bootstrap.css',
					'public/lib/font-awesome/css/font-awesome.css',
					'public/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
					'public/lib/growl/stylesheets/jquery.growl.css'
				],
				js: [
					'public/lib/angular/angular.js',
					'public/lib/angular-resource/angular-resource.js',
					'public/lib/angular-sanitize/angular-sanitize.js',
					'public/lib/angular-ui-router/release/angular-ui-router.js',
					'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
					'public/lib/jquery/dist/jquery.js',
					'public/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
					'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',
					'public/lib/growl/javascripts/jquery.growl.js',
					'public/lib/angular-confirm/angular-confirm.js',
					'public/lib/angular-gravatar/build/angular-gravatar.js'
				]
			},
			css: [
				'public/modules/admin/**/css/*.css'
			],
			js: [
				'public/config.js',
				'public/application.js',
				'public/modules/admin/*/*.js',
				'public/modules/admin/*/*[!tests]*/*.js',
				'public/modules/core/services/notification.client.service.js',
				'public/modules/users/users.client.module.js',
				'public/modules/users/services/users.client.service.js'
			],
			tests: [
				//'public/lib/angular-mocks/angular-mocks.js',
				//'public/modules/*/tests/*.js'
			]
		}
	},
	apis: {
		importIo: {
			userId: 'f5314fd8-339b-4c2e-9bd5-a903ba866bcd',
			apiKey: 'f5314fd8-339b-4c2e-9bd5-a903ba866bcd:jtPcuILZD9uJ4HMBWcAKX/6cBXUR3HXIo/z/KHMNBzbLUkxr2xAgmsXvVU6koy68eTvEEO18pKiWRII+Wd8a2w=='
		}
	},
	scrapper: {
		importInterval: 3600000
	}
};
