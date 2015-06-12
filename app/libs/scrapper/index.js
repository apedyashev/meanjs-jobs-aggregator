'use strict';

var importIo = require('./import.io.js')(),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    Job = mongoose.model('Job');

module.exports = function() {
    /**
     *
     * @param onDone(err, jsonResponse)
     */
    function runImport(onDone) {
        importIo.runExtractor('3d4bc7b2-5524-4ead-be6e-e5acd9340f8a', 'http://www.jobscout24.ch/de/jobs/?regidl=2',
                                function(error, jsonResponse) {

            if (!error) {
                async.each(jsonResponse.results, function(jobData, stepDone) {
                    try {
                        var job = new Job(jobData);
                        job.save(stepDone);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }, function eachDone(err) {
                    onDone(error, jsonResponse.results);
                });
            }
        });
    }

    // Interface
    return {
        run: runImport
    };
};
