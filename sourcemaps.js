/* Results on Node 20.3.1, Github Actions:

PostCSS: 199 ms
*/

let { existsSync, readFileSync } = require('node:fs')
let { join } = require('node:path')
const postcss = require('postcss')

let example = join(__dirname, 'cache', 'bootstrap.css')
let css = readFileSync(example).toString()

module.exports = {
  maxTime: 15,
  name: 'Sourcemaps',
  tests: [
    {
      defer: true,
      fn: done => {
        let root = postcss.parse(css, { from: example })
        root.toResult({ map: { inline: false }, to: 'dist/bootstrap.css' }).map.toJSON()

        root = postcss.parse(css, { from: example })
        root.toResult({ map: { absolute: true, inline: false }, to: 'dist/bootstrap.css' }).map.toJSON()

        root = postcss.parse(css, { from: example })
        root.toResult({ map: { inline: true }, to: 'dist/bootstrap.css' })

        done.resolve()
      },
      name: 'PostCSS'
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  module.exports.tests.splice(1, 0, {
    defer: true,
    fn: done => {
      let root = devPostcss.parse(css, { from: example })
      root.toResult({ map: { inline: false }, to: 'dist/bootstrap.css' }).map.toJSON()

      root = devPostcss.parse(css, { from: example })
      root.toResult({ map: { absolute: true, inline: false }, to: 'dist/bootstrap.css' }).map.toJSON()

      root = devPostcss.parse(css, { from: example })
      root.toResult({ map: { inline: true }, to: 'dist/bootstrap.css' })

      done.resolve()
    },
    name: 'Next PostCSS'
  })
}
