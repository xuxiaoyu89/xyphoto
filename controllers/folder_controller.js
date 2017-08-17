const File = require('../models/file.js');
const Folder = require('../models/folder.js');
const FolderService = require('../services/folder_service.js');
const logger = require('../lib/util/logger.js');

const FolderController = {
  // return folders and files in this folder
  open: async (req, res, next) => {
    req = req.body;
    let folderID = req.folder_id;
    let result;
    try { 
      result = await FolderService.openFolder(folderID);
    } catch (err) {
      next(err);
    }
    res.status(200).send(result);
  },

  // create a new folder in the current folder
  create: async (req, res, next) => {
    req = req.body;
    let parentFolderID = req.parent_folder_id;
    let folderName = req.folder_name;
    let newFolder = null;
    try {
      newFolder = await FolderService.createFolder(parentFolderID, folderName);
    } catch (err){
      return next(err);
    }
    res.status(200).send(newFolder);
  }
};

module.exports = FolderController;