'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var shelljs = require('shelljs');
var semver = require('semver');

module.exports = yeoman.generators.Base.extend({
  initializing: function(){
    this.pkg = require('../package.json');
    this.appConfig = {};
    this.sourceRoot(path.join(__dirname, 'templates'));
  },

  constructor: function(){
    yeoman.Base.apply(this, arguments);
  },

  prompting: function(){
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is your app name?',
      default: path.basename(process.cwd()),
      validate: function(input){
        return !!input || 'app name is required';
      }
    }, {
      type: 'input',
      name: 'version',
      message: 'What is your app version?',
      default: '1.0.0',
      validate: function(input){
        return !!semver.valid(input) || 'please use semver version, like 1.0.0';
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'What is your app description?'
    }, {
      type: 'checkbox',
      name: 'dependencies',
      message: 'Do you need some build-in dependencies?',
      choices: [
        {name: 'riot', checked: true},
        {name: 'fetch', checked: true},
        {name: 'es6-promise', checked: true},
        {name: 'zepto', checked: true},
        {name: 'angular', checked: false}
      ]
    }, {
      type: 'input',
      name: 'user',
      message: 'What is your git user name?',
      default: shelljs.exec('git config user.name', {silent: true}).output.replace(/\r?\n/g, '')
    }, {
      type: 'input',
      name: 'email',
      message: 'What is your git user email?',
      default: shelljs.exec('git config user.email', {silent: true}).output.replace(/\r?\n/g, '')
    }, {
      type: 'input',
      name: 'repository',
      message: 'What is your git repository?'
    }];

    //ask user 
    this.prompt(prompts, function(results){
      Object.keys(results).forEach(function(key){
        this.appConfig[key] = results[key];
      }, this);
      //this.log(this.appConfig);
      done();
    }.bind(this));
  },

  writing: {
    app: function(){
      //copy files
      this.directory('.', '.');

      //write meta
      ['package.json', 'component.json', 'README.md', 'views/index.html'].forEach(function(file){
        this.template(file, file, this.appConfig);
      }, this); 
    }
  },

  install: {
    component: function(){
      this.spawnCommand('ngfis', ['install', '--save'].concat(this.appConfig.dependencies));
    }
  },

  end: {
    git: function(){
      shelljs.exec('git init');
    },

    usage: function(){
      this.log(yosay([
        chalk.yellow('Usage'), 
        'ngfis release -wL',
        'ngfis server start',
        'ngfis publish'
        ].join('\n'))
      );
    }
  }
});
