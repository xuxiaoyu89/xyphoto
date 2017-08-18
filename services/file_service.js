const Promise = require('bluebird');
const tmp = require('tmp');
const request = require('request');
const fs = require('fs');
const File = require('../models/file.js');
const FileUtil = require('../lib/util/file.js');
const imageLambdaUrl = require('config').aws.lambda.image;
const s3Configs = require('config').aws.s3;
const logger = require('../lib/util/logger.js');

const thumbnailUrl = `${s3Configs.publicUrl}${s3Configs.files.thumbnail}`;

class FileService {
  constructor(filePath, cleanupFunction = null) {
    this.filePath = filePath;
    this.fileHash = '';
    this.fileType = null;
    this.fileUrl = '';
    this.thumbnailUrl = '';
    this.width = 0;
    this.height = 0;
    this.size = 0;
    this.meta = {};
    this.cleanupFunctions = [cleanupFunction];
  }

  async uploadFile() {
    let fileType = FileUtil.getFileType(this.filePath);
    this.fileUrl = await FileUtil.uploadImageToS3(this.filePath, fileType);
    logger.info(JSON.stringify(this.fileUrl));
    return this.fileUrl;
  }

  async processFile() {
    await new Promise((resolve, reject) => {
      logger.info(this.fileHash, this.fileType);
      request({
        url: imageLambdaUrl,
        method: "POST",
        json: true,
        body: {
          file_id: this.fileHash, 
          type: this.fileType
        }
      }, function (err, response, body){
        if (err || body == 'fail') {
          logger.error(err.message);
          reject(err);
        } else {
          this.thumbnailUrl = `${thumbnailUrl}${this.fileHash}.${this.fileType}`;
          resolve();
        }
      });
    });
  }

  async createFileModel(userID, folderID) {
    let fileModel = new File({
      file_id: this.fileHash,
      parent_folder_id: folderID,
      user_id: userID,
      file_type: this.fileType,
      file_url: this.fileUrl,
      file_thumbnail_url: this.thumbnailUrl,
      size: this.size,
      width: this.width,
      height: this.height,
      created_at: Date.now()
    });
    await new Promise((resolve, reject) => {
      fileModel.save(resolve);
    });
  }

  getInfo() {
    return {
      file_id: this.fileHash,
      file_url: this.fileUrl,
      file_thumbnail_url: this.thumbnailUrl
    };
  }

  async getMetadata() {
    this.fileHash = await FileUtil.getFileHash(this.filePath);
    this.fileType = FileUtil.getFileType(this.filePath);
    // TODO get file size
    this.size = 1000000;
    this.width = 100;
    this.height = 100;
  }

  cleanup() {
    this.cleanupFunctions.forEach(cleanup => {
      if (cleanup) {
        cleanup();
      }
    });
  }
};

module.exports = FileService;