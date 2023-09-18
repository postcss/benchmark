/* Results on Node 20.3.1, Github Actions:

Stylis:       15 ms  (1.8 times faster)
CSSOM:        24 ms  (1.2 times faster)
PostCSS:      28 ms
CSSTree:      37 ms  (1.3 times slower)
Mensch:       37 ms  (1.3 times slower)
Rework:       49 ms  (1.8 times slower)
Stylecow:     73 ms  (2.6 times slower)
PostCSS Full: 95 ms  (3.4 times slower)
ParserLib:    153 ms (5.5 times slower)
Gonzales:     177 ms (6.4 times slower)
*/

let { existsSync, readFileSync } = require('node:fs')
let postcssSP = require('postcss-selector-parser')
let postcssVP = require('postcss-value-parser')
let parserlib = require('parserlib')
let stylecow = require('stylecow-core')
let gonzales = require('gonzales')
let { join } = require('node:path')
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
