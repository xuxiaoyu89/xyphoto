const Promise = require('bluebird');
const Folder = require('../models/folder.js');
const logger = require('../lib/util/logger.js');

const FolderService = {
  openFolder: async (folderID) => {
    // get all the folders in the folderID
    const queryFolder = Promise.promisify(Folder.query);
    const folders = await queryFolder({
      parent_folder_id: {eq: folderID}
    });
    // get all the files in the folderID
    const queryFile = Promise.promisify(File.query);
    const files = await queryFile({
      parent_folder_id: {eq: folderID}
    });
    return { folders, files };
  },

  createFolder: async (parentFolderID, folderName = 'New Folder', description = '') => {
    // get an unique folder ID for the new folder
    // const userID = await FolderService.getFolderModelByID(parentFolderID).user_id;
    const userID = 'user_1';
    const newFolderID = createFolderID(userID);

    const newFolder = new Folder({
      folder_id: newFolderID,
      parent_folder_id: parentFolderID,
      user_id: userID,
      folder_name: folderName,
      file_count: 0,
      description: description,
      created_at: Date.now()
    });

    await new Promise((resolve, reject) => {
      logger.info(newFolder);
      newFolder.save(resolve);
    });

    //await Promise.promisify(newFolder.save)();
    return newFolder;
  },

  getFolderModelByID: async (folderID) => {
    let result;
    try {
      result = await Promise.promisify(Folder.query)({
        parent_folder_id: {eq: 'root'}
      });
    } catch (err) {
      logger.error(err.message);
      return null;
    }
    return result;
  }
};

function createFolderID(userID) {
  // userID + timeStamp
  return userID + Date.now();
}

module.exports = FolderService;