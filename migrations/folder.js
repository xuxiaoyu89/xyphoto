const db = require('./db.js');
const logger = require('../lib/util/logger.js');

const tableName = 'Folder';
const FolderTable = {
  create: async () => {
    logger.info('creating Folder table');
    let params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'parent_folder_id', KeyType: 'HASH' }, // partition
        { AttributeName: 'folder_id', KeyType: 'RANGE' }  // sort 
      ],
      AttributeDefinitions: [
        { AttributeName: 'parent_folder_id', AttributeType: 'S' },
        { AttributeName: 'folder_id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
      }
    }
    return db.createTable(params).promise();
  },
  delete: async () => {
    logger.info('deleting folder table');
    return db.deleteTable({TableName: tableName}).promise();
  }
} 

module.exports = FolderTable;
