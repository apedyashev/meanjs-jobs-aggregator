require('../../models/job.server.model');
const {Writable} = require('stream');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const Job = mongoose.model('Job');
const {camelizeKeys} = require('humps');
const _ = require('lodash');

class DBWritable extends Writable {
  constructor(options) {
    super({highWaterMark: 100, objectMode: true});
  }

  _saveJob(jobData) {
    const job = new Job(camelizeKeys(jobData));
    return job.save().then((j) => {
      // console.log('job saved',j)
    }).catch((err) => {
      if (err && (err.code === 11000) || (err.code === 11001)) {
        // duplicated key is not an error in this case because we just want to avoid duplicating
        // of jobs in database
        return Promise.resolve();
      } else {
        // console.log('error', err);
        return Promise.reject(err);
      }
    });
  }

  _write(chunk, encoding, callback) {
    this._saveJob(camelizeKeys(chunk)).asCallback(callback);
  }

  _writev(chunks, callback) {
    const entries = _.map(chunks, 'chunk').map((jobData) => {
      return camelizeKeys(jobData);
    });
    Promise.each(_.flatten(entries), this._saveJob).asCallback(callback);
  }
}

module.exports = DBWritable;
