let gulp = require('gulp')
let path = require('path')
let fs = require('fs-extra')

// Lint

gulp.task('lint', () => {
  let eslint = require('gulp-eslint')
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
  let cache = path.join(__dirname, 'cache', 'bootstrap.css')
  if (fs.existsSync(cache)) {
    done()
    return
  }

  let load = require('load-resources')
  load('github:twbs/bootstrap:dist/css/bootstrap.css', '.css', css => {
    fs.outputFile(cache, css, done)
  })
});

['preprocessors', 'parsers', 'prefixers', 'tokenizers'].forEach(name => {
  gulp.task(name, gulp.series('bootstrap', () => {
    let bench = require('gulp-bench')
    let summary = require('gulp-bench-summary')
    return gulp.src(`./${ name }.js`, { read: false })
      .pipe(bench())
      .pipe(summary(name === 'prefixers' ? 'Autoprefixer' : 'PostCSS'))
  }))
})

gulp.task('default',
  gulp.series('lint', 'preprocessors', 'parsers', 'prefixers', 'tokenizers'))
