var riot = require('riot');

riot.tag('todo', __inline('todo.tpl.html') , function(opts) {
  var self = this;
  this.items = opts.items;

  this.edit = function(e){
    self.text = e.target.value;
  };

  this.add = function(e){
    if(self.text) {
      self.items.push({title: self.text});
      self.text = self.input.value = '';
    }
  };

  this.filter = function(item){
    return !item.hidden;
  };

  this.toggle = function(e){
    var item = e.item;
    item.done = !item.done;
    return true;
  };
});