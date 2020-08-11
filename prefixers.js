/* Results on node 10.4.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

Stylis:       9 ms   (4.0 times faster)
Autoprefixer: 34 ms
Stylecow:     157 ms (4.6 times slower)
nib:          176 ms (5.1 times slower)
*/

let { existsSync, readFileSync } = require('fs')
let stylecowPrefixes = require('stylecow-plugin-prefixes')
let autoprefixer = require('autoprefixer')
let stylecow = require('stylecow-core')
let { join } = require('path')
let postcss = require('postcss')
let Stylis = require('stylis')

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

// Stylis
let stylis = new Stylis()

module.exports = {
  name: 'Bootstrap',
  maxTime: 15,
  tests: [
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
    },
    {
      name: 'Stylis',
      defer: true,
      fn: done => {
        stylis('', css)
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
