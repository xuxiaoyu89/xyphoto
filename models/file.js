const dynamoose = require('./db.js');
const Schema = dynamoose.Schema;

const fileSchema = new Schema({
  file_id: {
    type: String,
    rangeKey: true
  },
  parent_folder_id: {
    type: String,
    hashKey: true
  },
  user_id: {
    type: String
  },
  file_type: {
    type: String
  },
  file_url: {
    type: String
  },
  file_thumbnail_url: {
    type: String
  },
  size: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  tags: {
    type: [String]
  },
  created_at: {
    type: String
  },
  geo: {
    type: String
  },
  description: {
    type: String
  }
});

const FileModel = dynamoose.model('File', fileSchema);
module.exports = FileModel;

/*const db = require('./index.js');
const tableName = 'File';
const File = {
  createFile: async (fileID, parentID, userID, type, size=0, width=0, height=0, tags=[], geo='', description='') => {
    return db.putItem({
      Item: {
        'file_id': { S: userID },
        'parent_id': { S: parentID },
        'user_id': { S: userID },
        'type': { S: type }, // image, video
        'size': { N: size },
        'width': { N: width },
        'height': { N: height },
        'tags': { SS: tags },
        'created_at': { S: Date.now() },
        'geo': { S: geo },
        'description': { S: description }
      },
      ReturnValues: 'NONE',
      TableName: tableName
    }).promise();
  },

  getFile: async (fileID, parentID) => {
    return db.getItem({
      Key: {
        'file_id': {
          S: fileID
        },
        'parent_id': {
          S: parentID
        }
      },
      TableName: tableName
    }).promise();
  }
};

module.exports = File;*/