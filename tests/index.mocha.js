'use strict';

var assert = require('assert')
  , es = require('event-stream')
  , gulpCond = require(__dirname + '/../src/index.js')
  , Stream = require('readable-stream')
  , gutil = require('gulp-util')
;

// Helpers to create streams
function getStream() {
  var stream = new Stream.PassThrough({objectMode: true});
  setImmediate(function() {
    stream.write(new gutil.File({
      path: 'file.foo',
      contents: null
    }));
    setImmediate(function() {
      stream.write(new gutil.File({
        path: 'file.foo',
        contents: null
      }));
      setImmediate(function() {
        stream.write(new gutil.File({
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
  var stream = new Stream.Transform({objectMode: true});
  stream._transform = function(file, unused, cb) {
    file.path = prefix + file.path;
    this.push(file);
    cb();
  };
  return stream;
}

describe('gulp-cond', function() {

  describe('with a valid condition', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {

        var n = 0
          , ended1 = false
          , ended2 = false
        ;

        getStream()
          .pipe(gulpCond(true, getTrans('1').once('end', function() {
            ended1 = true;
          }), getTrans('2').once('end', function() {
            ended2 = true;
          })))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(ended1, true);
            assert.equal(ended2, false);
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(true, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

    describe('as a function', function() {

      it('should work', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return true;
          }, getTrans('1'), getTrans('2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return true;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '1file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

  });

  describe('with an invalid condition and a expr2', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans('1'), getTrans('2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

    describe('as a function', function() {

      it('should work', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans('1'), getTrans('2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

  });

  describe('with an invalid condition and no expr2', function() {

    describe('as a value', function() {

      it('should work with stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans('1')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(false, getTrans.bind(null, '1')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

    describe('as a function', function() {

      it('should work', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans('1')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, 'file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

      it('should work with fn returning a stream', function(done) {

        var n = 0;

        getStream()
          .pipe(gulpCond(function () {
            return false;
          }, getTrans.bind(null, '1'), getTrans.bind(null, '2')))
          .pipe(es.through(function(file) {
            assert.equal(file.path, '2file.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n, 3);
            done();
          }));

      });

    });

  });

});
