const express = require('express');
const router = express.Router();

router.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-XSRF-Token, Options, Origin');
  next();
});

router.use('/api', require('./api'));
// for all get request, send the main page instead of trying to find a file in this path.
// so there won't be a # in the url
router.get('*', (req, res, next) => {
  res.render('index');
});

module.exports = router;
