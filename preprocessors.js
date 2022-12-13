/* Results on Node 19.2.0, GitHub Actions:

PostCSS sync:   74 ms  (1.1 times faster)
PostCSS:        78 ms
LibSass sync:   110 ms (1.4 times slower)
LibSass:        112 ms (1.4 times slower)
Less:           140 ms (1.8 times slower)
Dart Sass sync: 197 ms (2.5 times slower)
Dart Sass:      376 ms (4.8 times slower)
*/

let { readFileSync, writeFileSync, existsSync } = require('fs')
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
