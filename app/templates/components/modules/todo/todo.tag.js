var riot = require('riot');
var fetch = require('fetch');

riot.tag('todo', __inline('todo.tpl.html') , function(opts) {
  var self = this;
  var url = __uri('./todo.json');
  this.items = opts.items;

  this.on('mount', function(){
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      self.items = json.items;
      self.update();
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
  });

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