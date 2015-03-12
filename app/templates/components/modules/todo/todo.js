var riot = require('riot');
var utils = require('framework/utils');

module.exports = function(container){
  require('todo.tag.js');
  riot.mount(container, 'todo', {
    title: 'todo dashboard',
    items: [
      { title: 'Avoid excessive coffeine', done: true },
      { title: 'Hidden item', hidden: true },
      { title: 'Be less provocative' },
      { title: 'Be nice to people' }
    ]
  });
};