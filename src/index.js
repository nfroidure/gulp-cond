var Stream = require('readable-stream');

const PLUGIN_NAME = 'gulp-cond';

// Plugin function
function gulpCond(condition, expr1, expr2) {

  var value = 'function' == typeof condition ? condition() : condition
    , outStream
  ;

  if(value) {
    outStream = 'function' == typeof expr1 ? expr1() : expr1;
  } else if(expr2) {
    outStream = 'function' == typeof expr2 ? expr2() : expr2;
  } else {
    outStream = new Stream.PassThrough({objectMode: true});
  }

  return outStream;

};

// Export the plugin main function
module.exports = gulpCond;

