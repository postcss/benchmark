let { existsSync, createWriteStream } = require('fs')
let { join, dirname } = require('path')
let { rm, mkdir } = require('fs/promises')
let { get } = require('https')
let gulp = require('gulp')

// Benchmark

gulp.task('clean', async () => {
  await rm(join(__dirname, 'cache'), { recursive: true, force: true })
})

gulp.task('bootstrap', async () => {
  let cache = join(__dirname, 'cache', 'bootstrap.css')
  await mkdir(dirname(cache), { recursive: true })
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
