let { existsSync, createWriteStream, remove } = require('fs-extra')
let { join } = require('path')
let { get } = require('https')
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

  get(
    'https://raw.githubusercontent.com/' +
      'twbs/bootstrap/main/dist/css/bootstrap.css',
    res => {
      if (res.statusCode !== 200) {
        throw new Error(`Failed to get Bootstrap: ${res.statusCode}`)
      }
      let file = createWriteStream(cache)
      file.on('finish', done)
      res.pipe(file)
    }
  )
})

for (let name of ['preprocessors', 'parsers', 'prefixers', 'tokenizers']) {
  gulp.task(
    name,
    gulp.series('bootstrap', () => {
      let bench = require('gulp-bench')
      let summary = require('gulp-bench-summary')
      return gulp
        .src(`./${name}.js`, { read: false })
        .pipe(bench())
        .pipe(summary(name === 'prefixers' ? 'Autoprefixer' : 'PostCSS'))
    })
  )
}

gulp.task(
  'default',
  gulp.series('preprocessors', 'parsers', 'prefixers', 'tokenizers')
)
