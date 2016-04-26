'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('admin/index', {
		user: req.user || null,
		request: req
	});
};
