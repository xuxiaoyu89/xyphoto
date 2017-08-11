const db = require('../models');
const logger = require('../lib/util/logger.js');

const tableName = 'Folder';
const FolderTable = {
  create: async () => {
    logger.info('creating Folder table');
    let params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'parent_id', KeyType: 'HASH' }, // partition
        { AttributeName: 'folder_id', KeyType: 'RANGE' }  // sort 
      ],
      AttributeDefinitions: [
        { AttributeName: 'parent_id', AttributeType: 'S' },
        { AttributeName: 'folder_id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
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