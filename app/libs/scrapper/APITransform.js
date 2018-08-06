const {Transform} = require('stream');
const moment = require('moment');

class APITransform extends Transform {
  constructor(options) {
    super({objectMode: true});
    this.offset = 0;
  }

  _transform($, enc, cb) {
    $('.joblist li.job').each((i, li) => {
      const $li = $(li);
      const $title = $li.find('.list-item-title a');
      const $jobAttributes = $li.find('.job-attributes');
      const company = $li.find('.company-data .company').text();
      const shortDescription = $li.find('.job-description').text();
      const datePosted = $jobAttributes.find('.date').text().trim();
      const datePostedMoment = moment(datePosted, 'DD.MM.YYYY');

      const data = {
        title: $title.text().trim(),
        link: `https://www.jobscout24.ch${$title.attr('href')}`,
        datePosted: datePostedMoment.isValid() ? datePostedMoment.format() : null,
        city: $jobAttributes.find('.city').text().trim(),
        levelOfEmployment: $jobAttributes.find('.level-of-employment').text().trim(),
        company: company.trim(),
        shortDescription: shortDescription.trim(),
      };
      this.push(data);
    });
    cb();
  }
}

module.exports = APITransform;
