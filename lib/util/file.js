/**
 * file operation util functions
 * - encoding and decoding to base64 format
 * - get image type of the file
 * - get MD5 hash of the file
 * - upload files to Amazon S3
*/
const fs = require('fs');
const Promise = require('bluebird');
const fileType = require('file-type');
const AWS = require('aws-sdk');
const path = require('path');
const crypto = require('crypto');
const request = require('request');
const readChunk = require('read-chunk');
const async = require('async');
const download = require('download');
const S3Config = require('config').aws.s3;
const tmp = require('tmp');
const logger = require('./logger.js');
const FILE_SIZE_LIMIT = 100000000;

const createTmpFile = Promise.promisify(tmp.file, {multiArgs: true});

/**
 * function to read a file and convert it to a base64 string
 *
 * @param file {string} full path of the input file
 * @return {string} base64 string of the input file
*/
async function base64Encode(file) {
  let readFile = Promise.promisify(fs.readFile);
  let data = await readFile(file);
  return new Buffer(data).toString('base64');
}

/**
 * function to create file from base64 encoded string
 *
 * @param base64Str {string} base64 string of the file
 * @param file {string} full path of the output file
*/
async function base64Decode(base64Str, file) {
  let bitmap = new Buffer(base64Str, 'base64');
  // write buffer to file
  let writeFile = Promise.promisify(fs.writeFile);
  await writeFile(file, bitmap);
  return;
}

/**
 * function to get type/extension of a file
 *
 * @param filename {string} full path of the input file
 * @return {string} type of the input file
*/
function getFileType(filename) {
  if((typeof filename) !== 'string') {
    return null;
  }

  let buff = readChunk.sync(filename, 0, 4100);
  let type = fileType(buff);
  if (!type) {
    return null;
  } else {
    return type.ext;
  }
}

/**
 * function to get mime type of a file
 *
 * @param filename {string} full path of the input file
 * @return {string} mime type of the input file
*/
function getFileMimeType(filename) {
  if((typeof filename) !== 'string') {
    return null;
  }

  let buff = readChunk.sync(filename, 0, 4100);
  let type = fileType(buff);
  if (!type) {
    return null;
  } else {
    return type.mime;
  }
}

/**
 * function to get size of a file
 *
 * @param url {string} url of the file
 * @param callback {function} callback function
*/
async function getFileSizeFromUrl(url) {
  let promisified_request = Promise.promisify(request);
  let headRes = await promisified_request({
    url: url,
    method: "HEAD"
  });

  return headRes.headers['content-length'];
}


/**
 * get the MD5 hash of the file content
 *
 * @param file {string} complete path of the file
 * @return string
*/
async function getFileHash(file) {
  let data = await base64Encode(file);
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * save file locally from a url
 *
 * @param url {string} url of the file
 * @param callback {function} callback function
*/
async function saveFileFromUrl(url) {
  let filePath, fd, cleanupFunction;

  try {
    let size = await getFileSizeFromUrl(url);
    if (size > FILE_SIZE_LIMIT) {
      throw(new Error(`Cannot download file from ${url}, file size too large.`));
    }

    [filePath, fd, cleanupFunction] = await createTmpFile();
    let data = await download(url);
    fs.writeFileSync(filePath, data);
  } catch (err) {
    if (cleanupFunction) cleanupFunction();
    throw(err);
  }

  return [filePath, cleanupFunction];
}

/**
 * save file locally from a base64 string
 *
 * @param base64 {string} base64 string of the file
 * @param callback {function} callback function
*/
async function saveFileFromBase64(base64) {
  let filePath, fd, cleanupFunction;

  try {
    [filePath, fd, cleanupFunction] = await createTmpFile();
    await base64Decode(base64, filePath);
  } catch (err) {
    if (cleanupFunction) cleanupFunction();
    throw(err);
  }

  return [filePath, cleanupFunction];
}

/**
 * upload image to Amazon S3
 *
 * @param file {string} complete path of the file
 * @param type {string} the file type the image
 * @param callback {function} callback function
 * @return string
*/
async function uploadImageToS3(file, type) {
  let fileHash, key, imageUrl;
  let bucket = new AWS.S3({
    params: {
      Bucket: S3Config.bucket
    }
  });

  try {
    fileHash = await getFileHash(file);
    key = path.join(
      S3Config.files.path,
      fileHash + '.' + type
    );

    const bucketUpload = () => {
      return new Promise((resolve, reject) => {
        bucket.upload(params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            let imageUrl = S3Config.publicUrl + key;
            resolve(imageUrl);
          }
        });
      });
    }    

    const params = {
      ACL: 'public-read',
      Key: key,
      Body: fs.createReadStream(file),
    };

    imageUrl = await bucketUpload(params);
  } catch (err) {
    throw(err);
  }
  return imageUrl;
}

// function to clean up temparate files
function cleanTmpFiles(cleanupFunctions) {
  // validation
  if (!cleanupFunctions || !Array.isArray(cleanupFunctions)) {
    return;
  }
  cleanupFunctions.forEach((cleanup) => {
    if (cleanup) cleanup();
    return;
  });
}

// future functionality to update files in s3
function updatefileInS3(filename, s3Url, callback) {

}

// future functionality to clean cache files in Akamai
function cleanUrlsAkamai(s3Url) {

}

module.exports = {
  'base64Decode': base64Decode,
  'base64Encode': base64Encode,
  'getFileType': getFileType,
  'getFileMimeType': getFileMimeType,
  'getFileHash': getFileHash,
  'saveFileFromUrl': saveFileFromUrl,
  'saveFileFromBase64': saveFileFromBase64,
  'uploadImageToS3': uploadImageToS3,
  'cleanTmpFiles': cleanTmpFiles
};