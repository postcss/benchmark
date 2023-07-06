/* Results on Node 20.3.1, Github Actions:

PostCSS sync:   70 ms  (1.0 times faster)
PostCSS:        72 ms
LibSass sync:   118 ms (1.6 times slower)
LibSass:        123 ms (1.7 times slower)
Less:           139 ms (1.9 times slower)
Dart Sass sync: 219 ms (3.0 times slower)
Dart Sass:      397 ms (5.5 times slower)
*/

let { existsSync, readFileSync, writeFileSync } = require('fs')
let postcssSimpleVars = require('postcss-simple-vars')
let postcssNested = require('postcss-nested')
let postcssMixins = require('postcss-mixins')
let { join } = require('path')
let postcss = require('postcss')
let libsass = require('node-sass')
let sass = require('sass')
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
let lcss = css.replace(/--[-\w]+:\s*;/g, '')
lcss += '@size: 100px;'
lcss += '.icon() { width: 16px; height: 16px; }'
for (i = 0; i < 100; i++) {
  lcss += 'body { h1 { a { color: black; } } }'
  lcss += 'h2 { width: @size; }'
  lcss += '.search { fill: black; .icon() }'
}

module.exports = {
  maxTime: 15,
  name: 'Preprocessors',
  tests: [
    {
      defer: true,
      fn: done => {
        libsass.render({ data: scss }, () => done.resolve())
      },
      name: 'LibSass'
    },
    {
      fn: () => {
        libsass.renderSync({ data: scss })
      },
      name: 'LibSass sync'
    },
    {
      defer: true,
      fn: done => {
        sass.render({ data: scss }, () => done.resolve())
      },
      name: 'Dart Sass'
    },
    {
      fn: () => {
        sass.renderSync({ data: scss })
      },
      name: 'Dart Sass sync'
    },
    {
      defer: true,
      fn: done => {
        processor.process(pcss, { from: example, map: false }).then(() => {
          done.resolve()
        })
      },
      name: 'PostCSS'
    },
    {
      defer: true,
      fn: done => {
        processor.process(pcss, { from: example, map: false }).css
        done.resolve()
      },
      name: 'PostCSS sync'
    },
    {
      defer: true,
      fn: done => {
        less.render(lcss, { math: 'strict' }, err => {
          if (err) throw err
          done.resolve()
        })
      },
      name: 'Less'
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
    defer: true,
    fn: done => {
      devProcessor.process(pcss, { from: example, map: false }).then(() => {
        done.resolve()
      })
    },
    name: 'Next PostCSS'
  })
  module.exports.tests.splice(8, 0, {
    defer: true,
    fn: done => {
      devProcessor.process(pcss, { from: example, map: false }).css
      done.resolve()
    },
    name: 'Next PostCSS sync'
  })
}
