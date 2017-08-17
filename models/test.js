const File = require('./file.js');
const Folder = require('./folder.js');
const logger = require('../lib/util/logger.js');

function run() {
  let folder = new Folder({
    folder_id: '2',
    parent_id: 'user_1',
    user_id: '1',
    created_at: Date.now(),
    file_count: 3
  });
  return new Promise((resolve, reject) => {
    folder.save((err) => {
      if (err) {
        logger.error(err);
        return reject(err);
      }
      return resolve();
    });
  });
}

run().then(() => {
  logger.info('created!');
});




