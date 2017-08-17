const logger = require('../lib/util/logger.js');
const FileTable = require('./file.js');
const FolderTable = require('./folder.js');

const DELETION_WAIT_TIME = 10000;


let wait = async (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

let force_init_db = async () => {
  try {
    await FileTable.delete();
  } catch (err) {
    if (err) {
      logger.error(err.message);
    } else {
      logger.info('File Table has been deleted');
    }
  }

  try {
    await FolderTable.delete();
  } catch (err) {
    if (err) {
      logger.error(err.message);
    } else {
      logger.info('Folder Table has been deleted');
    }
  }

  await wait(DELETION_WAIT_TIME);

  try {
    await FileTable.create();
  } catch (err) {
    if (err) {
      logger.error(err.message);
    } else {
      logger.info('File Table has been created');
    }
  }

  try {
    await FolderTable.create();
  } catch (err) {
    if (err) {
      logger.error(err.message);
    } else {
      logger.info('Folder Table has been created');
    }
  }
}

force_init_db();