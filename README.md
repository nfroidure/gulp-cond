# gulp-cond [![NPM version](https://badge.fury.io/js/gulp-cond.png)](https://npmjs.org/package/gulp-cond) [![Build status](https://secure.travis-ci.org/nfroidure/gulp-cond.png)](https://travis-ci.org/nfroidure/gulp-cond)
> A ternary operator for [Gulp](http://gulpjs.com/).

## Usage

First, install `gulp-cond` as a development dependency:

```shell
npm install --save-dev gulp-cond
```

Then, use it to conditionnaly pipe plugins in your `gulpfile.js`:

```javascript
var cond = require('gulp-cond')
  , prod = gulp.env.prod
;

// Images
gulp.task('build_images', function() {
  gulp.src('assets/images/**/*.svg')
    .pipe(cond(prod,
      gSvgmin(options), // minify SVG images under production
      gWatch().pipe(gLivereload(server))) // use live reload in dev mode
    )
    .pipe(gulp.dest('www/images'))
});
```

Alternatively, you can provide plugin functions instead of streams to
  instanciate streams only when needed :

```javascript
var cond = require('gulp-cond')
  , prod = gulp.env.prod
;

// Images
gulp.task('build_images', function() {
  gulp.src('assets/images/**/*.svg')
    .pipe(cond(prod,
      gSvgmin.bind(null, options), // minify SVG images under production
      function () { // use live reload in dev mode
        return gWatch().pipe(gLivereload(server));
      })
    )
    .pipe(gulp.dest('www/images'))
});
```

## API

### cond(condition, expr1, expr2)

#### condition
Type: `Boolean` or `Function`

Required. A value or a function providing a value. If the value is truthy, expr1
 will be used, else, expr2 will be use if provided.

#### expr1
Type: `Stream` or `Function`

Required. A stream or a function providing a stream.

#### expr1
Type: `Stream` or `Function`
Default value: `Stream.PassThrough`

A stream or a function providing a stream.

### Contributing / Issues

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.

