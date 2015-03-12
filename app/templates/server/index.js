'use strict';

var meta = require('../package.json');
var express = require('express');
var fs = require('fs');
var compress = require('compression');
var morgan = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
var cors = require('cors');
var rewrite = require('express-urlrewrite');
var app = module.exports = express();
var middleware = ['combo', 'router', 'proxy', 'static', 'error', 'inject'];

if(process.env.UAE_MODE === 'PROD'){
  app.set('env', 'production');
}else if(process.env.UAE_MODE === 'DEV'){
  app.set('env', 'development');
}

// lazy load middlewares
middleware.forEach(function (m) {
  middleware.__defineGetter__(m, function () {
    return require('./lib/' + m);
  });
});

process.on('uncaughtException', function (err) {
  (app.get('logger') || console).error('Uncaught exception:\n', err.stack);
});

app.set('name', meta.name);
app.set('version', meta.version);
app.set('port', process.env.PORT || 5000);
app.set('root', path.resolve(__dirname, '../').replace(/\/+$/, ''));
app.set('logger', console);
app.enable('trust proxy');

//icon
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

//robot
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.set('Cache-Control', 'public,max-age=86400');
  res.send("User-agent: *\nDisallow: /");
});

//日志
app.use(morgan('tiny', {
  skip: function (req, res){
    var delay = morgan['response-time'](req, res);
    return res.statusCode < 400 && delay < 300;
  },
  stream: app.get('env') === 'development' ? null : fs.createWriteStream(path.join(__dirname, '../private/log/access.log'), {flags: 'a'})
}));

app.use(compress());

//console.log('UAE_MODE:', process.env.UAE_MODE);
//console.log('ENV:', app.get('env'));
//console.log('PORT:', process.env.PORT);

if(app.get('env') === 'development') {
  app.use(middleware.inject());
}

//combo组合接口
app.use('/co', middleware.combo('/public'));

//proxy代理
//app.use('/api', middleware.proxy('http://your-host/'));


//单页面静态映射 /modules/* -> /?route=*
app.use(rewrite('/modules/:route+', '/?route=:route'));

//默认首页
app.use(middleware.router({
  index: '/' + meta.name + '/' + meta.version + '/index.html',
  headers: {
    'Cache-Control': 'public, max-age=600'
  }
}));

//TODO: 只允许静态文件跨域?
app.use(cors());

//静态文件
app.use('/latest', middleware.static('/public/' + meta.name + '/' + meta.version));
app.use(middleware.static());

//错误处理
app.use(middleware.error());

if(require.main === module){
  app.listen(app.get('port'), function(){
    console.log('[%s] Express server listening on port %d', app.get('env').toUpperCase(), app.get('port'));
  });
}