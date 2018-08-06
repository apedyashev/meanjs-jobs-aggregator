const APIReadable = require('./APIReadable');
const APITransform = require('./APITransform');
const DBWritable = require('./DBWritable');

function runScrapper() {
  const apiStream = new APIReadable();
  const t = new APITransform();
  const dbWriteStream = new DBWritable();

  apiStream.on('error', (err) => {
    console.log('api error', err);
  });
  t.on('error', (err) => {
    console.log('transform error', err);
  });
  dbWriteStream.on('error', (err) => {
    console.log('db error', err);
  });

  apiStream.on('end', () => {
    console.log('Scrapping done');
  });
  console.log('Start scrapping..');
  apiStream.pipe(t).pipe(dbWriteStream);
}

module.exports = runScrapper;
