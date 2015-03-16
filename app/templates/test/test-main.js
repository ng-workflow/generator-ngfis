require.config(__FRAMEWORK_CONFIG__);

var allTestFiles = []; //['angular', 'angular-mocks'];

var regex = new RegExp("^/.*?/" + require.options.name + '/' + require.options.version + '/');
Object.keys(window.__karma__.files).forEach(function(file) {
  if(/.*?\.spec\.js$/i.test(file)){
    var id = file.replace(regex, '');
    allTestFiles.push(id);
    console.log('loading: %s', id);
  }
});

window.__karma__.loaded = function(){};

setTimeout(function(){
  require.async(allTestFiles, function(){
    window.__karma__.start();
  });
}, 10);