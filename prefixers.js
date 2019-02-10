/* Results on node 10.4.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

Stylis:       9 ms   (4.0 times faster)
Autoprefixer: 34 ms
Stylecow:     157 ms (4.6 times slower)
nib:          176 ms (5.1 times slower)
*/

let path = require('path')
let fs = require('fs')

let example = path.join(__dirname, 'cache', 'bootstrap.css')
let origin = fs.readFileSync(example).toString()

// Autoprefixer
let autoprefixer = require('autoprefixer')
let postcss = require('postcss')

let css = postcss([autoprefixer({ browsers: [] })]).process(origin).css
let processor = postcss([autoprefixer])

// Stylecow
let stylecow = require('stylecow-core')
let stylecowOut = new stylecow.Coder()
let stylecower = new stylecow.Tasks()
stylecower.use(require('stylecow-plugin-prefixes'))

// nib
let stylus = require('stylus')
let styl = '@import \'nib\';\n' + css
  .replace('@charset "UTF-8";', '')
  .replace(/\}/g, '}\n').replace(/(\w)\[[^\]]+\]/g, '$1')
  .replace(/filter:[^;}]+;?/ig, '')
  .replace(/(@keyframes[^{]+)\{/ig, '$1 {')
  .replace(/url\([^)]+\)/ig, 'white')

// Compass
let scss = '@import \'compass/css3\';\n' + css
  .replace(/([^-])transform:([^;}]+)(;|})/g, '$1@include transform($2)$3')
  .replace(/transition:([^;}]+)(;|})/g, '@include transition($1)$2')
  .replace(
    /background(-image)?:((linear|radial)([^;}]+))(;|})/g,
    '@include background($2)$5'
  )
  .replace(/box-sizing:([^;}]+)(;|})/g, '@include box-sizing($1)$2')
let scssFile = path.join(__dirname, 'cache/bootstrap.prefixers.scss')
fs.writeFileSync(scssFile, scss)

// Stylis
let Stylis = require('stylis')
let stylis = new Stylis()

module.exports = {
  name: 'Bootstrap',
  maxTime: 15,
  tests: [
    {
      name: 'Autoprefixer',
      defer: true,
      fn: done => {
        processor.process(css, {
          from: example, map: false
        }).then(() => {
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
      name: 'nib',
      defer: true,
      fn: done => {
        stylus(styl)
          .include(require('nib').path)
          .render(err => {
            if (err) throw err
            done.resolve()
          })
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

let devA = path.join(__dirname, '../autoprefixer/build/lib/autoprefixer.js')
let devP = path.join(__dirname, '../postcss/build/lib/postcss.js')
if (fs.existsSync(devA) && fs.existsSync(devP)) {
  let devAutoprefixer = require(devA)
  let devPostcss = require(devP)
  let devProcessor = devPostcss([devAutoprefixer])
  module.exports.tests.splice(0, 0, {
    name: 'Autoprefixer dev',
    defer: true,
    fn: done => {
      devProcessor.process(css, {
        from: example, map: false
      }).then(() => {
        done.resolve()
      })
    }
  })
}
