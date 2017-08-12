const Promise = require('bluebird');
const File = require('../models/file.js');
const Folder = require('../models/folder.js');;

const FolderController = {
  open: async (req, res, next) => {
    req = req.body;
    let folderID = req.folder_id;
    let result;
    try { 
      result = await openFolder(folderID);
    } catch (err) {
      next(err);
    }
    res.status(200).send(result);
  }
};

async function openFolder(folderID) {
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
}

module.exports = FolderController;