'use strict';

/**
 *  Implements communication with import.io's API
 */

var sprintf = require('sprintf'),
    request = require('request'),
    config = require('../../../config/config');

module.exports = function() {
    var apiBaseUrl = 'https://api.import.io/store/data';

    /**
     * Performs import of the data from importedUrl using import.io's API and extractorId
     *
     * @param extractorId                   - ID of extractor created at www.import.io
     * @param importedUrl                   - url to be imported from
     * @param onDone(err, jsonResponse)
     */
    function runExtractor(extractorId, importedUrl, onDone) {
        var url = sprintf('%s/%s/_query?input/webpage/url=%s&_user=%s&_apikey=%s', apiBaseUrl, extractorId, encodeURIComponent(importedUrl),
                            config.apis.importIo.userId, encodeURIComponent(config.apis.importIo.apiKey)),
            options = {
                url: url
            };

        request(options, function(err, response, body) {
            if (err) {
                onDone(err);
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
