/* Results on node 10.4.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

Stylis:         13 ms  (2.7 times faster)
PostCSS:        35 ms
Rework:         38 ms  (1.1 times slower)
LibSass sync:   82 ms  (2.3 times slower)
LibSass:        90 ms  (2.5 times slower)
Less:           91 ms  (2.6 times slower)
Dart Sass sync: 103 ms (2.9 times slower)
Dart Sass:      169 ms (4.8 times slower)
Stylecow:       199 ms (5.6 times slower)
*/

let { readFileSync, writeFileSync, existsSync } = require('fs')
let postcssSimpleVars = require('postcss-simple-vars')
let postcssNested = require('postcss-nested')
let postcssMixins = require('postcss-mixins')
let postcssCalc = require('postcss-calc')
let stylecow = require('stylecow-core')
let { join } = require('path')
let postcss = require('postcss')
let libsass = require('node-sass')
let Stylis = require('stylis')
let sass = require('sass')
let myth = require('myth')
let less = require('less')

let example = join(__dirname, 'cache', 'bootstrap.css')
let origin = readFileSync(example).toString()
let i

let css = origin
  .replace(/\s+filter:[^;}]+;?/g, '')
  .replace('/*# sourceMappingURL=bootstrap.css.map */', '')

// PostCSS
let processor = postcss([
  postcssNested,
  postcssSimpleVars,
  postcssCalc,
  postcssMixins
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
let rcss = css
rcss += ':root { --size: 100px; }'
for (i = 0; i < 100; i++) {
  rcss += 'body h1 a { color: black; }'
  rcss += 'h2 { width: var(--size); }'
  rcss += 'h1 { width: calc(2 * var(--size)); }'
  rcss += '.search { fill: black; width: 16px; height: 16px; }'
}

// Stylecow
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
let scss = css
scss += '$size: 100px;'
scss += '@mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  scss += 'body { h1 { a { color: black; } } }'
  scss += 'h2 { width: $size; }'
  scss += 'h1 { width: 2 * $size; }'
  scss += '.search { fill: black; @include icon; }'
}
let scssFile = join(__dirname, 'cache', 'bootstrap.preprocessors.scss')
writeFileSync(scssFile, scss)

// Less
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
      name: 'Less',
      defer: true,
      fn: done => {
        less.render(lcss, { math: 'strict' }, err => {
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

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
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
