/* Results on Node 19.2.0, GitHub Actions:

Stylis:       14 ms  (2.3 times faster)
CSSOM:        22 ms  (1.5 times faster)
CSSTree:      31 ms  (1.1 times faster)
PostCSS:      33 ms
Mensch:       33 ms  (1.0 times slower)
Rework:       51 ms  (1.5 times slower)
Stylecow:     66 ms  (2.0 times slower)
PostCSS Full: 93 ms  (2.8 times slower)
ParserLib:    141 ms (4.2 times slower)
Gonzales:     159 ms (4.8 times slower)
*/

let { readFileSync, existsSync } = require('fs')
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
  name: 'Parsers',
  maxTime: 15,
  tests: [
    {
      name: 'Rework',
      fn: () => {
        rework(css).toString()
      }
    },
    {
      name: 'PostCSS',
      defer: true,
      fn: done => {
        postcss.parse(css, { from: example }).toResult()
        done.resolve()
      }
    },
    {
      name: 'PostCSS Full',
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
      }
    },
    {
      name: 'CSSOM',
      fn: () => {
        CSSOM.parse(css).toString()
      }
    },
    {
      name: 'Mensch',
      fn: () => {
        mensch.stringify(mensch.parse(css))
      }
    },
    {
      name: 'Gonzales',
      fn: () => {
        gonzales.csspToSrc(gonzales.srcToCSSP(css))
      }
    },
    {
      name: 'CSSTree',
      fn: () => {
        csstree.generate(csstree.parse(css))
      }
    },
    {
      name: 'ParserLib',
      fn: () => {
        new parserlib.css.Parser().parse(css)
      }
    },
    {
      name: 'Stylecow',
      fn: () => {
        stylecow.parse(css).toString()
      }
    },
    {
      name: 'Stylis',
      fn: () => {
        stylis.serialize(stylis.compile(css), stylis.stringify)
      }
    }
  ]
}

let devPath = join(__dirname, '../postcss/lib/postcss.js')
if (existsSync(devPath)) {
  let devPostcss = require(devPath)
  module.exports.tests.splice(1, 0, {
    name: 'Next PostCSS',
    defer: true,
    fn: done => {
      devPostcss.parse(css, { from: example }).toResult()
      done.resolve()
    }
  })
}
