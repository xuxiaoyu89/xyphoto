const fs = require('fs');
const File = require('../models/').File;
const logger = require('../lib/util/logger.js');


const FileController = {
  add: (ws, request) => {
    ws.on('message', (file) => {
      logger.info(file);
      logger.info('hello');
      fs.writeFile("/tmp/test", file, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      }); 
      ws.send('hello from server');
    });
  }
}

module.exports = FileController;