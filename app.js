const express = require('express');
const http = require('http');
const cors = require('cors');
const logger = require('./lib/util/logger.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = http.createServer(app);
const expressWs = require('express-ws')(app, server);

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
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// PORT conflicts with Marathon environment variable, use HOST_PORT instead.
const port = normalizePort(process.env.HOST_PORT || '3100');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function () {
  logger.info('XYPhoto listening on port ' + port);
});

module.exports = server;
