'use strict';

var express = require('express');
var path = require('path');
var app = require('../index');

module.exports = function (dir) {
  dir = dir || '/public';
  return express.static(app.get('root') + dir, {
    //maxAge: app.get('env') === 'production' ? Infinity : 0,
    setHeaders: function(res, filePath, stat){
      if(app.get('env') === 'production') {
        var ext = path.extname(filePath);
        if (ext === '.html' || ext === '.json') {
          res.set('Cache-Control', 'public, max-age=600');
        } else if (res.req.url.indexOf('/pkg/') === 0) {
          res.set('Cache-Control', 'public, max-age=600');
        } else {
          res.set('Cache-Control', 'public, max-age=' + (60 * 60 * 24 * 365));
        }
      }
    }
  });
};