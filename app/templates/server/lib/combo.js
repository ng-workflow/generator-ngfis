'use strict';

var path = require('path');
var fs = require('fs');
var app = require('./../index');
var memoize = require('memoizee');

module.exports = function (dir) {
  dir = dir || '/public/';
  var root = app.get('root') + dir;
  var logger = app.get('logger') || console;

  var memoized = memoize(readFile, {
    primitive: true,
    //length: 3,
    //resolvers: [String, String, String],
    max: 500,
    maxAge: 1000 * 60 * 60 * 24,
    preFetch: true
  });
  var regex = /^[^?]*\?\?([^;&]*);?([^&]*)&?(.*)$/;

  // url:  /co??f1,f2;/prefix&hash
  return function (req, res){
    var m = req.originalUrl.match(regex);
    if(m && m[1]){
      var url = m[1];
      var prefix = m[2] || '';
      //var hash = m[3] || '';
      try {
        if(prefix.indexOf('../') !== -1){
          res.send(406, '[combo] malicious prefix: ' + prefix);
        }else{
          var basePath = path.join(root, prefix.replace(/^\//, ''));
          var files = url && url.split(',');
          var contents = [];
          //读取每个文件
          files.forEach(function(file){
            var content;
            try{
              content = memoized(basePath, file);
              if (content){
                contents.push(content);
              }
            }catch(e){
              res.set('Error-Message', e.message);
              logger.error('[combo] ' + e.message + ' , originalUrl: ' + req.originalUrl);
            }
          });

          if (contents.length !== files.length) {
            logger.error('[combo] some files not found');
          }

          //set headers
          var ext = path.extname(url);
          if(ext){
            res.type(ext.slice(1));
          }
          res.set('Cache-Control', 'public,max-age=' + (app.get('env') === 'production' ? 60 * 60 * 24 * 365 : 0));
          res.set('Content-Type', 'application/javascript');
          res.send(contents.join('\n'));
        }
      }catch(e){
        res.send(406, e.message + '\nUsage: /co??f1,f2;/prefix&hash');
      }
    }else{
      res.send('I am a combo service :)\nUsage: /co??f1,f2;/prefix&hash');
    }
  };
};

//read file
function readFile(basePath, filePath){
  var logger = app.get('logger') || console;
  var ext = path.extname(filePath);
  if(ext !== '.css' && ext !== '.js' || filePath.indexOf('../') !== -1){
    throw ('[combo] malicious file: ' + filePath);
  }else{
    var realPath = path.resolve(basePath, filePath);
    var content;
    //console.log('readFile: ', realPath);
    content = fs.readFileSync(realPath, 'utf-8');
    return content;
  }
}