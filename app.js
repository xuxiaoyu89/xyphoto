/*
  entry point of the image optimization service
  run command: node app.js
*/
const express = require('express');
const cors = require('cors');
const logger = require('./lib/util/logger.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const ExpressWs = require('express-ws')
const app = express();
ExpressWs(app);
const router = require('./routes/index.js');

app.use(cors());

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Set Static Folder
app.use(express.static('public'));
app.use(express.static('client'));

app.use(require('morgan')('combined', {'stream': logger.stream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', router);

// error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500);
  res.json({error: err.message});
})

module.exports = app;
