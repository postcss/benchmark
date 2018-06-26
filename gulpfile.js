const sequence = require('gulp-sequence')
const gulp = require('gulp')
const path = require('path')
const fs = require('fs-extra')

// Lint

gulp.task('lint', () => {
  const eslint = require('gulp-eslint')
  return gulp.src(['*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// Benchmark

gulp.task('clean', done => {
  fs.remove(path.join(__dirname, '/cache'), done)
})

gulp.task('bootstrap', done => {
  const cache = path.join(__dirname, 'cache', 'bootstrap.css')
  if (fs.existsSync(cache)) {
    done()
    return
  }

  const load = require('load-resources')
  load('github:twbs/bootstrap:dist/css/bootstrap.css', '.css', css => {
    fs.outputFile(cache, css, done)
  })
});

['preprocessors', 'parsers', 'prefixers', 'tokenizers'].forEach(name => {
  gulp.task(name, ['bootstrap'], () => {
    const bench = require('gulp-bench')
    const summary = require('gulp-bench-summary')
    return gulp.src(`./${ name }.js`, { read: false })
      .pipe(bench())
      .pipe(summary(name === 'prefixers' ? 'Autoprefixer' : 'PostCSS'))
  })
})

gulp.task('default',
  sequence('lint', 'preprocessors', 'parsers', 'prefixers', 'tokenizers'))
