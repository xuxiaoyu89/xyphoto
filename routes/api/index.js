const express = require('express');
const router = express.Router();
const FolderController = require('../../controllers/folder_controller.js');


// read api
// get all the files in parent id

router.post('/open', FolderController.open); // return all files and folders in folder with parentID
//router.post('/search', (params) => {});
 
/*// write api
// add a new folder
router.post('/add-folder', (name, parentID) => {});

// update folder info
router.post('/update-folder', (params, folderID) => {});

// delete folder
router.post('/delete-folder', (folderID) => {});

// add files
router.post('/add-files', (files, parentID) => {});

// update file
router.post('/update-file', (params, fileID) => {});

// delete file
router.post('/delete-file', (fileID) => {});*/


module.exports = router;