let { existsSync, outputFile, remove } = require('fs-extra')
let { join } = require('path')
let gulp = require('gulp')

// Benchmark

gulp.task('clean', done => {
  remove(join(__dirname, 'cache'), done)
})

gulp.task('bootstrap', done => {
  let cache = join(__dirname, 'cache', 'bootstrap.css')
  if (existsSync(cache)) {
    done()
    return
  }

  let load = require('load-resources')
  load('github:twbs/bootstrap:dist/css/bootstrap.css', '.css', css => {
    outputFile(cache, css, done)
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
  gulp.series('preprocessors', 'parsers', 'prefixers', 'tokenizers')
)
