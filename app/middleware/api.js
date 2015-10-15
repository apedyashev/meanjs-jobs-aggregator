var cors = require('cors');

module.exports = function apiHeaders(req, res, next) {
    cors()(req, res, next);
};
