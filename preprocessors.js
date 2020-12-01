/* Results on Node 14.10.1, Fedora 32, Intel Core i7-1065G7, 16 GB RAM, and SSD:

PostCSS sync:   27 ms  (1.1 times faster)
PostCSS:        30 ms
Rework:         33 ms  (1.1 times slower)
LibSass sync:   64 ms  (2.1 times slower)
LibSass:        66 ms  (2.2 times slower)
Dart Sass sync: 77 ms  (2.6 times slower)
Dart Sass:      138 ms (4.5 times slower)
Less:           410 ms (13.5 times slower)
*/

let { readFileSync, writeFileSync, existsSync } = require('fs')
let postcssSimpleVars = require('postcss-simple-vars')
let postcssNested = require('postcss-nested')
let postcssMixins = require('postcss-mixins')
let { join } = require('path')
let postcss = require('postcss')
let libsass = require('node-sass')
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
let processor = postcss([postcssNested, postcssSimpleVars, postcssMixins])
let pcss = css
pcss += '$size: 100px;'
pcss += '@define-mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  pcss += 'body { h1 { a { color: black; } } }'
  pcss += 'h2 { width: $size; }'
  pcss += '.search { fill: black; @mixin icon; }'
}

// Myth
let rcss = css
rcss += ':root { --size: 100px; }'
for (i = 0; i < 100; i++) {
  rcss += 'body h1 a { color: black; }'
  rcss += 'h2 { width: var(--size); }'
  rcss += '.search { fill: black; width: 16px; height: 16px; }'
}

// Sass
let scss = css
scss += '$size: 100px;'
scss += '@mixin icon { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  scss += 'body { h1 { a { color: black; } } }'
  scss += 'h2 { width: $size; }'
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
  lcss += '.search { fill: black; .icon() }'
}

module.exports = {
  name: 'Preprocessors',
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
        myth(rcss, { features: { prefixes: false, variables: false } })
        done.resolve()
      }
    },
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        processor.process(pcss, { from: example, map: false }).then(() => {
          done.resolve()
        })
      }
    },
    {
      name: 'PostCSS sync',
      defer: true,
      fn: done => {
        processor.process(pcss, { from: example, map: false }).css
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
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  let devProcessor = devPostcss([
    postcssNested,
    postcssSimpleVars,
    postcssMixins
  ])
  module.exports.tests.splice(6, 0, {
    name: 'Next PostCSS',
    defer: true,
    fn: done => {
      devProcessor.process(pcss, { from: example, map: false }).then(() => {
        done.resolve()
      })
    }
  })
  module.exports.tests.splice(8, 0, {
    name: 'Next PostCSS sync',
    defer: true,
    fn: done => {
      devProcessor.process(pcss, { from: example, map: false }).css
      done.resolve()
    }
  })
}
