const fs = require('fs');
const tmp = require('tmp');
const File = require('../models/').File;
const logger = require('../lib/util/logger.js');
const FileService = require('../services/file_service.js');


const FileController = {
  add: async (ws, request) => {
    let userID, folderID;
    ws.on('message', async (data) => {
      let message;
      try {
        message = JSON.parse(data);
      } catch (err) {
        return handleFile(data, userID, folderID, ws);
      }
      userID = message.user_id;
      folderID = message.folder_id;
      ws.send(JSON.stringify({
        type: 'start'
      }));
    });
  }
}

async function handleFile(blob, userID, folderID, ws) {
  let file;
  let filePath, cleanupFunction;
  [filePath, cleanupFunction] = await saveFile(blob);
  let message = {
    type: 'saved'
  };
  ws.send(JSON.stringify(message));

  // upload file to s3
  file = new FileService(filePath, cleanupFunction);
  await file.getMetadata();
  await file.uploadFile();
  await file.processFile();
  await file.createFileModel(userID, folderID);
  message = {
    type: 'uploaded',
    file_info: file.getInfo()
  };
  ws.send(JSON.stringify(message));
  file.cleanup();
}

async function saveFile(blob) {
  let filePath, cleanupFunction;
  let createFile = () => {
    return new Promise((resolve, reject) => {
      tmp.file((err, path, fd, cleanup) => {
        if (err) {
          reject(err);
        } else {
          resolve([path, cleanup]);
        }
      });
    });
  }
  [filePath, cleanupFunction] = await createFile();
  fs.writeFileSync(filePath, blob);
  return [filePath, cleanupFunction];
}

module.exports = FileController;