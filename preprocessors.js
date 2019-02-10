/* Results on node 10.4.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

Stylis:         13 ms  (2.7 times faster)
PostCSS:        35 ms
Rework:         38 ms  (1.1 times slower)
LibSass sync:   82 ms  (2.3 times slower)
Stylus:         87 ms  (2.5 times slower)
LibSass:        90 ms  (2.5 times slower)
Less:           91 ms  (2.6 times slower)
Dart Sass sync: 103 ms (2.9 times slower)
Dart Sass:      169 ms (4.8 times slower)
Stylecow:       199 ms (5.6 times slower)
*/

let path = require('path')
let fs = require('fs')

let example = path.join(__dirname, 'cache', 'bootstrap.css')
let origin = fs.readFileSync(example).toString()
let i

let css = origin
  .replace(/\s+filter:[^;}]+;?/g, '')
  .replace('/*# sourceMappingURL=bootstrap.css.map */', '')

// PostCSS
let postcss = require('postcss')
let processor = postcss([
  require('postcss-nested'),
  require('postcss-simple-vars'),
  require('postcss-calc'),
  require('postcss-mixins')
])
let pcss = css
pcss += '$size: 100px;'
pcss += '@define-mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  pcss += 'body { h1 { a { color: black; } } }'
  pcss += 'h2 { width: $size; }'
  pcss += 'h1 { width: calc(2 * $size); }'
  pcss += '.search { fill: black; @mixin icon; }'
}

// Myth
let myth = require('myth')
let rcss = css
rcss += ':root { --size: 100px; }'
for (i = 0; i < 100; i++) {
  rcss += 'body h1 a { color: black; }'
  rcss += 'h2 { width: var(--size); }'
  rcss += 'h1 { width: calc(2 * var(--size)); }'
  rcss += '.search { fill: black; width: 16px; height: 16px; }'
}

// Stylecow
let stylecow = require('stylecow-core')
let stylecowOut = new stylecow.Coder()
let stylecower = new stylecow.Tasks()
stylecower.use(require('stylecow-plugin-nested-rules'))
stylecower.use(require('stylecow-plugin-variables'))
stylecower.use(require('stylecow-plugin-calc'))
let cowcss = css
cowcss += ':root { --size: 100px; }'
for (i = 0; i < 100; i++) {
  cowcss += 'body { h1 { a { color: black; } } }'
  cowcss += 'h2 { width: var(--size); }'
  cowcss += 'h1 { width: calc(2 * var(--size)); }'
  cowcss += '.search { fill: black; width: 16px; height: 16px; }'
}

// Sass
let libsass = require('node-sass')
let scss = css
scss += '$size: 100px;'
scss += '@mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  scss += 'body { h1 { a { color: black; } } }'
  scss += 'h2 { width: $size; }'
  scss += 'h1 { width: 2 * $size; }'
  scss += '.search { fill: black; @include icon; }'
}
let scssFile = path.join(__dirname, 'cache', 'bootstrap.preprocessors.scss')
fs.writeFileSync(scssFile, scss)

// Dart Sass
let sass = require('sass')

// Stylus
let stylus = require('stylus')
let styl = css
styl += 'size = 100px;'
styl += 'icon() { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  styl += 'body { h1 { a { color: black; } } }'
  styl += 'h2 { width: size; }'
  styl += 'h1 { width: 2 * size; }'
  styl += '.search { fill: black; icon(); }'
}

// Less
let less = require('less')
let lcss = css
lcss += '@size: 100px;'
lcss += '.icon() { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  lcss += 'body { h1 { a { color: black; } } }'
  lcss += 'h2 { width: @size; }'
  lcss += 'h1 { width: 2 * @size; }'
  lcss += '.search { fill: black; .icon() }'
}

// Stylis
let Stylis = require('stylis')
let stylisObj = new Stylis()
let styi = css
styi += ':root { --size: 100px; }'
styi += '@mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  styi += 'body h1 a { color: black; }'
  styi += 'h2 { width: var(--size); }'
  styi += 'h1 { width: calc(2 * var(--size)); }'
  styi += '.search { fill: black; @include icon; }'
}

stylisObj.use([
  require('stylis-mixin'),
  require('stylis-calc'),
  require('stylis-custom-properties')
])

module.exports = {
  name: 'Bootstrap',
  maxTime: 15,
  tests: [
    {
      name: 'LibSass',
      defer: true,
      fn: done => {
        libsass.render({ data: scss }, () => done.resolve())
      }
    },
    {
      name: 'LibSass sync',
      fn: () => {
        libsass.renderSync({ data: scss })
      }
    },
    {
      name: 'Dart Sass',
      defer: true,
      fn: done => {
        sass.render({ data: scss }, () => done.resolve())
      }
    },
    {
      name: 'Dart Sass sync',
      fn: () => {
        sass.renderSync({ data: scss })
      }
    },
    {
      name: 'Rework',
      defer: true,
      fn: done => {
        myth(rcss, { features: { prefixes: false } })
        done.resolve()
      }
    },
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        processor.process(pcss, {
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
        let code = stylecow.parse(cowcss)
        stylecower.run(code)
        stylecowOut.run(code)
        done.resolve()
      }
    },
    {
      name: 'Stylus',
      defer: true,
      fn: done => {
        stylus.render(styl, { filename: example }, err => {
          if (err) throw err
          done.resolve()
        })
      }
    },
    {
      name: 'Less',
      defer: true,
      fn: done => {
        less.render(lcss, err => {
          if (err) throw err
          done.resolve()
        })
      }
    },
    {
      name: 'Stylis',
      defer: true,
      fn: done => {
        stylisObj('', styi)
        done.resolve()
      }
    }
  ]
}

let devPath = path.join(__dirname, '../postcss/build/lib/postcss.js')
if (fs.existsSync(devPath)) {
  let devPostcss = require(devPath)
  let devProcessor = devPostcss([
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-calc'),
    require('postcss-mixins')
  ])
  module.exports.tests.splice(6, 0, {
    name: 'PostCSS dev',
    defer: true,
    fn: done => {
      devProcessor.process(pcss, {
        from: example, map: false
      }).then(() => {
        done.resolve()
      })
    }
  })
}
