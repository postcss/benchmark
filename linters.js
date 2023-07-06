/* Results on Node 19.9.0, GitHub Actions:

PostCSS: 826 ms
*/

let { readFileSync, existsSync } = require('fs')
let stylelint = require("stylelint")
let { join } = require('path')
let postcss = require('postcss')

let example = join(__dirname, 'cache', 'bootstrap.css')
let origin = readFileSync(example).toString()

let css = origin
  .replace(/\s+filter:[^;}]+;?/g, '')
  .replace('/*# sourceMappingURL=bootstrap.css.map */', '')

// PostCSS
let processor = postcss([stylelint({ config: { "extends": "stylelint-config-standard" } })])

module.exports = {
  name: 'Linters',
  maxTime: 15,
  tests: [
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        processor.process(css, { from: example, map: false }).then(() => {
          done.resolve()
        })
      }
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  let devProcessor = devPostcss([
    stylelint({ config: { "extends": "stylelint-config-standard" } })
  ])
  module.exports.tests.splice(1, 0, {
    name: 'Next PostCSS',
    defer: true,
    fn: done => {
      devProcessor.process(css, { from: example, map: false }).then(() => {
        done.resolve()
      })
    }
  })
}
