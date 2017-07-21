/*
 * Logger
 * print time and message to the console
*/
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const winston = require('winston');
require('winston-papertrail').Papertrail;
winston.emitErrs = true;

const logsDirectory = './logs';
const logFileName = moment().format('YYYY-MM-DD') + '.log';

function initLogDirectory() {
  try {
    fs.statSync(logsDirectory).isDirectory();
  }
  catch(error) {
    // Directory does not exist, so create it
    fs.mkdirSync(logsDirectory);
  }
}

function initLogFile() {
  try {
    fs.accessSync(logFilePath, fs.F_OK);
  }
  catch(error) {
    // File does not exist, so create it
    fs.writeFileSync(path.join(logsDirectory, logFileName), '');
  }
}

function initializeLogger() {
  initLogDirectory();
  initLogFile();
}

initializeLogger();

let transports = [
  new winston.transports.File({
    level: 'info',
    filename: path.join(logsDirectory, logFileName),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
  }),
  new winston.transports.Console({
    timestamp: true,
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  })
];

// If the Papertrail transport is enabled, set it here...
if (process.env.LOGGER_TRANSPORT_PAPERTRAIL_HOST &&
    process.env.LOGGER_TRANSPORT_PAPERTRAIL_PORT) {
  let papertrail = new winston.transports.Papertrail({
    host: process.env.LOGGER_TRANSPORT_PAPERTRAIL_HOST,
    port: process.env.LOGGER_TRANSPORT_PAPERTRAIL_PORT,
    level: 'debug',
    program: process.env.LOGGER_TRANSPORT_PAPERTRAIL_NAME,
    handleExceptions: true,
    json: false,
    colorize: true
  });
  transports.push(papertrail);
}

let logger = new winston.Logger({
  transports,
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};

