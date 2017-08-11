const Promise = require('bluebird');
const Folder = require('../models').Folder;
const File = require('../models').File;

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
  console.log('in open function');
  console.log(Folder);
  // get all the folders in the folderID
  const query = Promise.promisify(Folder.query);
  const folders = await query({
    parent_id: {eq: folderID}
  });
  // get all the files in the folderID
  const files = await query({
    parent_id: {eq: folderID}
  });
  console.log(folders);
  return { folders, files };
}

module.exports = FolderController;