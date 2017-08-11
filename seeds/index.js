const fileSeeds = require('./files.js');
const folderSeeds = require('./folders.js');
const FileModel = require('../models/file.js');
const FolderModel = require('../models/folder.js');
const logger = require('../lib/util/logger.js');

async function createFiles() {
  logger.info('creating file seeds');
  await Promise.all(fileSeeds.map((fileParams) => {
    fileParams.created_at = Date.now();
    let file = new FileModel(fileParams);
    return file.save();
  }));
  return;
}

async function createFolders() {
  logger.info('creating folder seeds');
  await Promise.all(folderSeeds.map((folderParams) => {
    folderParams.created_at = Date.now();
    let folder = new FolderModel(folderParams);
    return folder.save();
  }));
  return;
}

createFiles();
createFolders();