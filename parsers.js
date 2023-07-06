/* Results on Node 19.9.0, GitHub Actions:

Stylis:       14 ms  (2.3 times faster)
CSSOM:        25 ms  (1.3 times faster)
CSSTree:      32 ms  (1.0 times faster)
PostCSS:      33 ms
Mensch:       34 ms  (1.0 times slower)
Rework:       52 ms  (1.6 times slower)
Stylecow:     75 ms  (2.3 times slower)
PostCSS Full: 98 ms  (3.0 times slower)
Gonzales:     159 ms (4.8 times slower)
ParserLib:    161 ms (4.9 times slower)
*/

let { existsSync, readFileSync } = require('fs')
let postcssSP = require('postcss-selector-parser')
let postcssVP = require('postcss-value-parser')
let parserlib = require('parserlib')
let stylecow = require('stylecow-core')
let gonzales = require('gonzales')
let { join } = require('path')
let csstree = require('css-tree')
let postcss = require('postcss')
let rework = require('rework')
let mensch = require('mensch')
let stylis = require('stylis')
let CSSOM = require('cssom')

let example = join(__dirname, 'cache', 'bootstrap.css')
let css = readFileSync(example).toString()

module.exports = {
  maxTime: 15,
  name: 'Parsers',
  tests: [
    {
      fn: () => {
        rework(css).toString()
      },
      name: 'Rework'
    },
    {
      defer: true,
      fn: done => {
        postcss.parse(css, { from: example }).toResult()
        done.resolve()
      },
      name: 'PostCSS'
    },
    {
      defer: true,
      fn: done => {
        let root = postcss.parse(css, { from: example })
        root.walk(node => {
          if (node.type === 'rule') {
            node.selectorAST = postcssSP().process(node.selector)
          } else if (node.type === 'decl') {
            node.valueAST = postcssVP(node.value)
          }
        })
        root.toResult()
        done.resolve()
      },
      name: 'PostCSS Full'
    },
    {
      fn: () => {
        CSSOM.parse(css).toString()
      },
      name: 'CSSOM'
    },
    {
      fn: () => {
        mensch.stringify(mensch.parse(css))
      },
      name: 'Mensch'
    },
    {
      fn: () => {
        gonzales.csspToSrc(gonzales.srcToCSSP(css))
      },
      name: 'Gonzales'
    },
    {
      fn: () => {
        csstree.generate(csstree.parse(css))
      },
      name: 'CSSTree'
    },
    {
      fn: () => {
        new parserlib.css.Parser().parse(css)
      },
      name: 'ParserLib'
    },
    {
      fn: () => {
        stylecow.parse(css).toString()
      },
      name: 'Stylecow'
    },
    {
      fn: () => {
        stylis.serialize(stylis.compile(css), stylis.stringify)
      },
      name: 'Stylis'
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  module.exports.tests.splice(1, 0, {
    defer: true,
    fn: done => {
      devPostcss.parse(css, { from: example }).toResult()
      done.resolve()
    },
    name: 'Next PostCSS'
  })
}
