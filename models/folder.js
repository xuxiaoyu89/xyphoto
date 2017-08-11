const dynamoose = require('./db.js');
const Schema = dynamoose.Schema;

const folderSchema = new Schema({
  folder_id: {
    type: String,
    rangeKey: true
  },
  parent_id: {
    type: String,
    hashKey: true
  },
  user_id: {
    type: String
  },
  file_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: String
  },
  description: {
    type: String,
    default: ''
  }
});

const FolderModel = dynamoose.model('Folder', folderSchema);
module.exports = FolderModel;

/*const db = require('./index.js');
const tableName = 'Folder';
const Folder = {
  createFolder: async (folderID, parentID, userID, fileCount=0, description='') => {
    return db.putItem({
      Item: {
        'file_id': { S: userID },
        'parent_id': { S: parentID },
        'user_id': { S: userID },
        'file_count': { S: fileCount },        
        'created_at': { S: Date.now() },
        'description': { S: description }
      },
      ReturnValues: 'NONE',
      TableName: tableName
    }).promise();
  }
};

module.exports = Folder;*/