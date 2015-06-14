'use strict';

/**
 * This library exports first 100 jobs from the 1st page of jobscout24.ch (all regions, all categories)
 * and saves them to DB.
 *
 * Checking of jobs duplication must be performed by DB (link field must be unique). This library only checks
 * if model throws an error with code 11000 or 11001 ('Unique field already exists') and doesn't pass the upper level
 */

var importIo = require('./import.io.js')(),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    Job = mongoose.model('Job');

module.exports = function() {
    /**
     * Starts import and passes results to callback
     *
     * @param onDone(err, jsonResponse)
     */
    function runImport(onDone) {
        var scrapFromUrl = 'http://www.jobscout24.ch/de/jobs/?regidl=1-2-3-13-4-5-6-7-8-9-10-11&p=1&ps=100';
        importIo.runExtractor('3d4bc7b2-5524-4ead-be6e-e5acd9340f8a', scrapFromUrl, function(error, jsonResponse) {
            if (!error) {
                // save all the results received from the extractor to DB
                async.each(jsonResponse.results, function(jobData, stepDone) {
                    try {
                        jobData.date = moment(jobData.date, 'DD.MM.YYYY').format();
                        console.log(jobData.date);
                        var job = new Job(jobData);
                        job.save(function(err) {
                            if (err && (err.code !== 11000) && (err.code !== 11001)) {
                                stepDone(err);
                            }
                            else {
                                // duplicated key is not an error in this case because we just want to avoid duplicating
                                // of jobs in database
                                stepDone();
                            }
                        });
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }, function eachDone(err) {
                    onDone(err, jsonResponse.results);
                });
            }
        });
    }

    // Interface
    return {
        run: runImport
    };
};
