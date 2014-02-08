var Stream = require('stream');

const PLUGIN_NAME = 'gulp-cond';


// Plugin function
function gulpCond(condition, expr1, expr2) {

  var value = 'function' == typeof condition ? condition() : condition
    , inStream
    , endCallback
    , outStream
  ;

  if(value) {
    outStream = expr1 instanceof Stream ? expr1 : expr1();
  } else if(expr2) {
    outStream = expr2 instanceof Stream ? expr2 : expr2();
  } else {
    return new Stream.PassThrough({objectMode: true});
  }

  inStream = new Stream.Transform({objectMode: true});

  outStream.once('end', function() {
    endCallback();
  });

  inStream._transform = function(file, unused, cb) {
    outStream.once('data', function (file) {
      inStream.push(file);
      cb();
    });
    outStream.write(file);
  };

  inStream._flush = function(cb) {
    endCallback = cb;
    outStream.end();
  };

  return inStream;

};

// Export the plugin main function
module.exports = gulpCond;

