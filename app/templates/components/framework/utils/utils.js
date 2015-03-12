/**
 * 辅助工具类
 */

//===================================================================================
// type check
//===================================================================================
exports.isString = function(s) { return (typeof s === 'string') || s instanceof String; };
exports.isNumber = function(n) { return (typeof n === 'number') || n instanceof Number; };
exports.isBool = function(b) { return b === !!b || b instanceof Boolean; };
// non-primitive builtin types
exports.isFunction = function(f) { return (typeof f === 'function'); };
// array - delegates to builtin if available
exports.isArray  = Array.isArray || function(a) { return Object.prototype.toString.call(a) === '[object Array]'; };
// basically all Javascript types are objects
exports.isObject = function(o) { return o === Object(o); };
// duck typing, because there isn't really a good way to do this
exports.isRegex  = function(r) { return !!(r && r.test && r.exec && (r.ignoreCase || r.ignoreCase === false)); };


//===================================================================================
// format
//===================================================================================
/**
 * 格式化字符串模版,支持2种格式:
 *
 *   formatStr("i can speak {language} since i was {age}",{language:'javascript',age:10});
 *   formatStr("i can speak {0} since i was {1}",'javascript',10);
 *
 * 如果不希望被转义,则用两个括号,如: `formatStr("i can speak {0} since i was {{1}",'javascript',10);`
 *
 */
exports.formatStr = function(tpl, obj){
  obj = typeof obj === 'object' ? obj : Array.prototype.slice.call(arguments, 1);
  return tpl.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return obj.hasOwnProperty(n) ? obj[n] : '';
  });
};

/**
 * format date.
 *
 *     formatDate(new Date(),"yyyy-MM-dd hh:mm:ss")
 *     formatDate(new Date().setHours(0,0,0,0),"yyyy-MM-dd hh:mm:ss")
 *
 * 更建议用类库: [moment.js](http://momentjs.com/)
 *
 * @param {Date/Number} [obj] date to format, support Date or timestamp
 * @param {String} [format] 格式
 * @return {String} 格式化后的字符串
 */
exports.formatDate = function(obj, format){
  var date = obj || new Date();
  if(obj && obj.toString !== '[object Date]'){
    if(isNaN(obj)){
      date = new Date(obj);
    }else{
      date = new Date();
      date.setTime(obj);
    }
  }

  format = format || "yyyy-MM-dd hh:mm:ss";

  var o = {
    "M+" : date.getMonth()+1, //month
    "d+" : date.getDate(),    //day
    "h+" : date.getHours(),   //hour
    "m+" : date.getMinutes(), //minute
    "s+" : date.getSeconds(), //second
    "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
    "S" : date.getMilliseconds() //millisecond
  };
  if(/(y+)/.test(format)){
    format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
};
