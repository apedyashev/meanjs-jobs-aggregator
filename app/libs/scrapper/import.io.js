'use strict';

var sprintf = require('sprintf'),
    request = require('request'),
    config = require('../../../config/config');

module.exports = function() {
    var apiBaseUrl = 'https://api.import.io/store/data';

    /**
     *
     * @param extractorId
     * @param importedUrl
     * @param onDone(error, jsonResponse)
     */
    function runExtractor(extractorId, importedUrl, onDone) {
        var url = sprintf('%s/%s/_query?input/webpage/url=%s&_user=%s&_apikey=%s', apiBaseUrl, extractorId, encodeURIComponent(importedUrl),
                            config.apis.importIo.userId, encodeURIComponent(config.apis.importIo.apiKey)),
            options = {
                url: url
            };

        request(options, function(error, response, body) {
            if (error) {
                onDone(error);
            }
            else {
                onDone(null, JSON.parse(body));
            }
        });
    }

    return {
        runExtractor: runExtractor
    };
};
