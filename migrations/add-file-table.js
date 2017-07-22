const AWS = require('aws-sdk');
const logger = require('../lib/util/logger.js');

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

let dynamodb = new AWS.DynamoDB();

let params = {
  TableName: 'files',
  KeySchema: [
    {AttributeName: 'user_id', KeyType: 'HASH'}, // partition
    {AttributeName: 'parent', KeyType: 'RANGE'}  // sort 
  ],
  AttributeDefinitions: [
    { AttributeName: 'parent', AttributeType: 'N' },
    { AttributeName: 'user_id', AttributeType: 'N'}
  ],
  ProvisionedThroughput: {       
    ReadCapacityUnits: 5, 
    WriteCapacityUnits: 5
  }
}

dynamodb.createTable(params, (err, data) => {
  if (err) {
    logger.error('Unable to create table', err.message);
  } else {
    logger.info('Created table');
  }
});



