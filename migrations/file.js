const db = require('../models');
const logger = require('../lib/util/logger.js');

const tableName = 'File';
const FileTable = {
  create: async () => {
    logger.info('creating File table');
    let params = {
      TableName: 'File',
      KeySchema: [
        { AttributeName: 'parent_id', KeyType: 'HASH' }, // partition
        { AttributeName: 'file_id', KeyType: 'RANGE' }  // sort 
      ],
      AttributeDefinitions: [
        { AttributeName: 'parent_id', AttributeType: 'S' },
        { AttributeName: 'file_id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
      }
    };
    return db.createTable(params).promise();
  },
  delete: async () => {
    logger.info('deleting File table');
    return db.deleteTable({TableName: tableName}).promise();
  }
} 

module.exports = FileTable;
