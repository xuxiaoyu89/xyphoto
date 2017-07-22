const AWS = require('aws-sdk');
const logger = require('../lib/util/logger.js');

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

let dynamodb = new AWS.DynamoDB();

const params = {
  Item: {
    'user_id': {
      N: '1'
    },
    'parent': {
      N: '0'
    }
  },
  ReturnConsumedCapacity: 'TOTAL',
  TableName: 'files'
};

dynamodb.putItem(params, (err, data) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info(data);
  }
});