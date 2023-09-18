/* Results on Node 20.3.1, Github Actions:

PostCSS: 577 ms
*/

let { existsSync, readFileSync } = require('node:fs')
let stylelint = require('stylelint')
let { join } = require('node:path')
let postcss = require('postcss')

let example = join(__dirname, 'cache', 'bootstrap.css')
let origin = readFileSync(example).toString()

let css = origin
  .replace(/\s+filter:[^;}]+;?/g, '')
  .replace('/*# sourceMappingURL=bootstrap.css.map */', '')

// PostCSS
let processor = postcss([
  stylelint({ config: { extends: 'stylelint-config-standard' } })
])

module.exports = {
  maxTime: 15,
  name: 'Linters',
  tests: [
    {
      defer: true,
      fn: done => {
        processor.process(css, { from: example, map: false }).then(() => {
          done.resolve()
        })
      },
      name: 'PostCSS'
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  let devProcessor = devPostcss([
    stylelint({ config: { extends: 'stylelint-config-standard' } })
  ])
  module.exports.tests.splice(1, 0, {
    defer: true,
    fn: done => {
      devProcessor.process(css, { from: example, map: false }).then(() => {
        done.resolve()
      })
    },
    name: 'Next PostCSS'
  })
}
