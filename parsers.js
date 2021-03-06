/* Results on Node.js 15.2.1, Fedora 33, Intel Core i7-1065G7, and 16 GB RAM:

Stylis:       5 ms  (3.1 times faster)
CSSTree:      9 ms  (1.7 times faster)
PostCSS:      16 ms
CSSOM:        18 ms (1.2 times slower)
Mensch:       21 ms (1.3 times slower)
Rework:       27 ms (1.7 times slower)
Stylecow:     39 ms (2.5 times slower)
PostCSS Full: 67 ms (4.3 times slower)
ParserLib:    74 ms (4.7 times slower)
Gonzales:     74 ms (4.7 times slower)
Gonzales PE:  82 ms (5.2 times slower)
*/

let { readFileSync, existsSync } = require('fs')
let gonzalesPe = require('gonzales-pe')
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
      name: 'Gonzales PE',
      fn: () => {
        gonzalesPe.parse(css).toString()
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
