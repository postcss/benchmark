/* Results on Node 20.3.1, Github Actions:

Lightning CSS: 12 ms   (7.7 times faster)
Stylis:        18 ms   (5.3 times faster)
Autoprefixer:  96 ms
Stylecow:      1009 ms (10.5 times slower)
*/

let { existsSync, readFileSync } = require('node:fs')
let stylecowPrefixes = require('stylecow-plugin-prefixes')
let autoprefixer = require('autoprefixer')
let browserslist = require('browserslist')
let lightning = require('lightningcss')
let stylecow = require('stylecow-core')
let { join } = require('node:path')
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
  maxTime: 15,
  name: 'Prefixers',
  tests: [
    {
      fn: () => {
        stylis.serialize(
          stylis.compile(css),
          stylis.middleware([stylis.prefixer, stylis.stringify])
        )
      },
      name: 'Stylis'
    },
    {
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
      },
      name: 'Autoprefixer'
    },
    {
      fn: () => {
        lightning.transform({
          code: cssBuffer,
          filename: example,
          minify: false,
          sourceMap: false,
          targets: lightningBrowsers
        })
      },
      name: 'Lightning CSS'
    },
    {
      defer: true,
      fn: done => {
        let code = stylecow.parse(css)
        stylecower.run(code)
        stylecowOut.run(code)
        done.resolve()
      },
      name: 'Stylecow'
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
    },
    name: 'Autoprefixer dev'
  })
}
