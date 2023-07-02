/* Results on Node 19.9.0, GitHub Actions:

Lightning CSS: 15 ms   (6.9 times faster)
Stylis:        17 ms   (5.8 times faster)
Autoprefixer:  101 ms
Stylecow:      1032 ms (10.2 times slower)
*/

let { existsSync, readFileSync } = require('fs')
let stylecowPrefixes = require('stylecow-plugin-prefixes')
let autoprefixer = require('autoprefixer')
let browserslist = require('browserslist')
let lightning = require('lightningcss')
let stylecow = require('stylecow-core')
let { join } = require('path')
let postcss = require('postcss')
let stylis = require('stylis')

let example = join(__dirname, 'cache', 'bootstrap.css')
let origin = readFileSync(example).toString()

let browsers = browserslist('defaults')

// Autoprefixer
let cleaner = postcss([autoprefixer({ overrideBrowserslist: [] })])
let css = cleaner.process(origin, { from: example }).css
let processor = postcss([autoprefixer({ overrideBrowserslist: browsers })])

// Stylecow
let stylecowOut = new stylecow.Coder()
let stylecower = new stylecow.Tasks()
stylecower.use(stylecowPrefixes)

// Lightning
let lightningBrowsers = lightning.browserslistToTargets(browsers)
let cssBuffer = Buffer.from(css)

module.exports = {
  name: 'Prefixers',
  maxTime: 15,
  tests: [
    {
      name: 'Stylis',
      fn: () => {
        stylis.serialize(
          stylis.compile(css),
          stylis.middleware([stylis.prefixer, stylis.stringify])
        )
      }
    },
    {
      name: 'Autoprefixer',
      defer: true,
      fn: done => {
        processor
          .process(css, {
            from: example,
            map: false
          })
          .then(() => {
            done.resolve()
          })
      }
    },
    {
      name: 'Lightning CSS',
      fn: () => {
        lightning.transform({
          filename: example,
          code: cssBuffer,
          targets: lightningBrowsers,
          minify: false,
          sourceMap: false
        })
      }
    },
    {
      name: 'Stylecow',
      defer: true,
      fn: done => {
        let code = stylecow.parse(css)
        stylecower.run(code)
        stylecowOut.run(code)
        done.resolve()
      }
    }
  ]
}

let devA = join(__dirname, '../autoprefixer/lib/autoprefixer.js')
let devP = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devA) && existsSync(devP)) {
  let devAutoprefixer = require(devA)
  let devPostcss = require(devP)
  let devProcessor = devPostcss([devAutoprefixer])
  module.exports.tests.splice(0, 0, {
    name: 'Autoprefixer dev',
    defer: true,
    fn: done => {
      devProcessor
        .process(css, {
          from: example,
          map: false
        })
        .then(() => {
          done.resolve()
        })
    }
  })
}
