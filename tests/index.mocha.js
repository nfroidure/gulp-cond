'use strict';

var assert = require('assert');
var gulpCond = require('../src');
var Stream = require('readable-stream');
var File = require('vinyl');

// Helpers to create streams
function getStream() {
  var stream = Stream.PassThrough({objectMode: true});
  setImmediate(function () {
    stream.write(new File({
      path: 'file.foo',
      contents: null
    }));
    setImmediate(function () {
      stream.write(new File({
        path: 'file.foo',
        contents: null
      }));
      setImmediate(function () {
        stream.write(new File({
          path: 'file.foo',
          contents: null
        }));
        stream.end();
      });
    });
  });
  return stream;
}

function getTrans(prefix) {
  return Stream.Transform({
    objectMode: true,
    transform: function(file, unused, cb) {
      file.path = prefix + file.path;
      cb(null, file);
    }
  });
}

describe('gulp-cond', function() {

  describe('with a valid condition', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {
        var n = 0;
        var ended1 = false;
        var ended2 = false;

        getStream()
          .pipe(gulpCond(true, getTrans('1').once('end', function() {
            ended1 = true;
          }), getTrans('2').once('end', function() {
            ended2 = true;
          })))
          .on('data', function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(ended1, true);
            assert.equal(ended2, false);
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(true, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .on('data', function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

    describe('as a function', function() {

      it('should work', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return true;
          }, getTrans('1'), getTrans('2')))
          .on('data', function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return true;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .on('data', function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

  });

  describe('with an invalid condition and a expr2', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans('1'), getTrans('2')))
          .on('data', function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .on('data', function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

    describe('as a function', function() {

      it('should work', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans('1'), getTrans('2')))
          .on('data', function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .on('data', function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

  });

  describe('with an invalid condition and no expr2', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans('1')))
          .on('data', function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans.bind(null, '1')))
          .on('data', function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

    describe('as a function', function() {

      it('should work', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans('1')))
          .on('data', function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

      it('should work with fn returning a stream', function(done) {
        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .on('data', function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          })
          .on('end', function () {
            assert.equal(n, 3);
            done();
          });
      });

    });

  });

});
