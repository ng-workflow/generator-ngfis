'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  req.url = router.options.index || '/';
  res.header(router.options.headers || {});
  next();
});

module.exports = function (options) {
  router.options = options || {};
  return router;
};