var riot = require('riot');
var utils = require('framework/utils');

module.exports = function(container){
  require('todo.tag.js');
  riot.mount(container, 'todo', {
    title: 'todo dashboard',
    items: [
    ]
  });
};