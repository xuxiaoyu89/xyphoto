const Promise = require('bluebird');
const tmp = require('tmp');
const fs = require('fs');
const File = require('../models/file.js');
const FileUtil = require('../lib/util/file.js');
const logger = require('../lib/util/logger.js');

class FileService {
    constructor(filePath, cleanupFunction = null) {
        this.filePath = filePath;
        this.fileHash = '';
        this.fileType = null;
        this.fileUrl = '';
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

    async createFileModel(userID, folderID) {
        await this.getMetadata();
        let fileModel = new File({
            file_id: this.fileHash,
            parent_folder_id: folderID,
            user_id: userID,
            file_type: this.fileType,
            file_url: this.fileUrl,
            file_thumbnail_url: this.fileUrl,
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