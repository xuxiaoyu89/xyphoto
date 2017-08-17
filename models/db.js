const dynamoose = require('dynamoose');

dynamoose.AWS.config.update({
  region: 'us-east-1'
});

module.exports = dynamoose;