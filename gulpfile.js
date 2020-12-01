let { existsSync, createWriteStream, remove, mkdirp } = require('fs-extra')
let { join, dirname } = require('path')
let { get } = require('https')
let gulp = require('gulp')

// Benchmark

gulp.task('clean', done => {
  remove(join(__dirname, 'cache'), done)
})

gulp.task('bootstrap', async () => {
  let cache = join(__dirname, 'cache', 'bootstrap.css')
  await mkdirp(dirname(cache))
  if (existsSync(cache)) return
  await new Promise((resolve, reject) => {
    let file = createWriteStream(cache)
    file.on('finish', () => resolve())
    get(
      'https://raw.githubusercontent.com/' +
        'twbs/bootstrap/main/dist/css/bootstrap.css',
      res => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get Bootstrap: ${res.statusCode}`))
          return
        }
        res.pipe(file)
      }
    )
  })
})

for (let name of ['preprocessors', 'parsers', 'prefixers', 'tokenizers']) {
  gulp.task(
    name,
    gulp.series('bootstrap', () => {
      let bench = require('gulp-bench')
      let summary = require('gulp-bench-summary')
      let benchmark = gulp.src(`./${name}.js`, { read: false }).pipe(bench())
      return benchmark.pipe(
        summary(name === 'prefixers' ? 'Autoprefixer' : 'PostCSS')
      )
    })
  )
}

gulp.task(
  'default',
  gulp.series('preprocessors', 'parsers', 'prefixers', 'tokenizers')
)
