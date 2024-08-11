import { describe, test, expect } from '@jest/globals';
import StreamTest from 'streamtest';
import gulpCond from './index.js';
import { Transform } from 'node:stream';
import File from 'vinyl';

function getStream() {
  return StreamTest.fromObjects([
    new File({
      path: 'file.foo',
      contents: null,
    }),
    new File({
      path: 'file.foo',
      contents: null,
    }),
    new File({
      path: 'file.foo',
      contents: null,
    }),
  ]);
}

function getTrans(prefix: string) {
  return new Transform({
    objectMode: true,
    transform: function (file, _, cb) {
      file.path = prefix + file.path;
      cb(null, file);
    },
  });
}

describe('gulp-cond', () => {
  describe('with a valid condition', () => {
    describe('as a value', () => {
      test('should work with stream', async () => {
        const [stream, result] = StreamTest.toObjects<File>();
        let ended1 = false;
        let ended2 = false;

        getStream()
          .pipe(
            gulpCond(
              true,
              getTrans('1').once('end', () => {
                ended1 = true;
              }),
              getTrans('2').once('end', () => {
                ended2 = true;
              }),
            ),
          )
          .pipe(stream);

        const objs = await result;

        objs.forEach(function (file) {
          expect(file.path).toEqual('1file.foo');
          expect(file.contents).toEqual(null);
        });
        expect(ended1).toEqual(true);
        expect(ended2).toEqual(false);
        expect(objs.length).toEqual(3);
      });

      test('should work with fn returning a stream', async () => {
        const [stream, result] = StreamTest.toObjects<File>();

        getStream()
          .pipe(
            gulpCond(true, getTrans.bind(null, '1'), getTrans.bind(null, '2')),
          )
          .pipe(stream);

        const objs = await result;

        objs.forEach(function (file) {
          expect(file.path).toEqual('1file.foo');
          expect(file.contents).toEqual(null);
        });
        expect(objs.length).toEqual(3);
      });
    });
  });

  describe('as a function', () => {
    test('should work', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(
            () => {
              return true;
            },
            getTrans('1'),
            getTrans('2'),
          ),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('1file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });

    test('should work with fn returning a stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(
            () => {
              return true;
            },
            getTrans.bind(null, '1'),
            getTrans.bind(null, '2'),
          ),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('1file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });
  });
});

describe('with an invalid condition and a expr2', () => {
  describe('as a value', () => {
    test('should work with stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(gulpCond(false, getTrans('1'), getTrans('2')))
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('2file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });

    test('should work with fn returning a stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(false, getTrans.bind(null, '1'), getTrans.bind(null, '2')),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('2file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });
  });

  describe('as a function', () => {
    test('should work', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(
            () => {
              return false;
            },
            getTrans('1'),
            getTrans('2'),
          ),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('2file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });

    test('should work with fn returning a stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(
            () => {
              return false;
            },
            getTrans.bind(null, '1'),
            getTrans.bind(null, '2'),
          ),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('2file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });
  });
});

describe('with an invalid condition and no expr2', () => {
  describe('as a value', () => {
    test('should work with stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(gulpCond(false, getTrans('1')))
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });

    test('should work with fn returning a stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(gulpCond(false, getTrans.bind(null, '1')))
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });
  });

  describe('as a function', () => {
    test('should work', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(() => {
            return false;
          }, getTrans('1')),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });

    test('should work with fn returning a stream', async () => {
      const [stream, result] = StreamTest.toObjects<File>();

      getStream()
        .pipe(
          gulpCond(
            () => {
              return false;
            },
            getTrans.bind(null, '1'),
            getTrans.bind(null, '2'),
          ),
        )
        .pipe(stream);

      const objs = await result;

      objs.forEach(function (file) {
        expect(file.path).toEqual('2file.foo');
        expect(file.contents).toEqual(null);
      });
      expect(objs.length).toEqual(3);
    });
  });
});
