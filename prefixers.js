/* Results on Node 14.10.1, Fedora 32, Intel Core i7-1065G7, 16 GB RAM, and SSD:

Stylis:       7 ms   (4.9 times faster)
Autoprefixer: 32 ms
Stylecow:     187 ms (5.9 times slower)
*/

let { existsSync, readFileSync } = require('fs')
let stylecowPrefixes = require('stylecow-plugin-prefixes')
let autoprefixer = require('autoprefixer')
let stylecow = require('stylecow-core')
let { join } = require('path')
let postcss = require('postcss')
let stylis = require('stylis')

let example = join(__dirname, 'cache', 'bootstrap.css')
let origin = readFileSync(example).toString()

// Autoprefixer
let cleaner = postcss([autoprefixer({ overrideBrowserslist: [] })])
let css = cleaner.process(origin, { from: example }).css
let processor = postcss([autoprefixer])

// Stylecow
let stylecowOut = new stylecow.Coder()
let stylecower = new stylecow.Tasks()
stylecower.use(stylecowPrefixes)

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
