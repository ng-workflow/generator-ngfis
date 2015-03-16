// Karma configuration
module.exports = function(config){
  var pkgInfo = require('./package.json');

  var basePath = ''; //exec('ngfis server echo-root');

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: basePath, //'C:/Users/TZ/AppData/Local/.ngfis-tmp/www/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      //监控源码
      //{pattern: 'src/**/*.*', included: false, served: false, watched: true}
      'public/' + pkgInfo.name + '/' + pkgInfo.version + '/lib/scrat/scrat.js',
      'public/' + pkgInfo.name + '/' + pkgInfo.version + '/lib/**/*.js',
      'test/' + pkgInfo.name + '/' + pkgInfo.version + '/**/*.spec.js',
      'test/test-main.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocess or
    preprocessors: {
    },

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
      //require('./test/karma-fis.js')
    ],

    client: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    //browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

//exec command
function exec(cmd){
  var child_process = require('child_process');
  var spawnSync = child_process.spawnSync;
  var file, args, options = {};
  if (process.platform === 'win32') {
    file = 'cmd.exe';
    args = ['/s', '/c', '"' + cmd + '"'];
    options.windowsVerbatimArguments = true;
  } else {
    file = '/bin/sh';
    args = ['-c', cmd];
  }
  var result = spawnSync(file, args, options);
  return result.output.toString().replace(/[,\s\r\n]/g, '');
}