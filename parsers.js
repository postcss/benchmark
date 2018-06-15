/* Results on node 9.11.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

CSSTree:      5 ms   (3.3 times faster)
Stylis:       9 ms   (1.9 times faster)
CSSOM:        12 ms  (1.3 times faster)
PostCSS:      16 ms
Mensch:       22 ms  (1.4 times slower)
Rework:       30 ms  (1.8 times slower)
Stylecow:     41 ms  (2.6 times slower)
PostCSS Full: 52 ms  (3.2 times slower)
Gonzales:     81 ms  (5.0 times slower)
Gonzales PE:  94 ms  (5.8 times slower)
ParserLib:    140 ms (8.7 times slower)
*/

const path = require('path')
const fs = require('fs')

const example = path.join(__dirname, 'cache', 'bootstrap.css')
const css = fs.readFileSync(example).toString()

const CSSOM = require('cssom')
const rework = require('rework')
const mensch = require('mensch')
const postcss = require('postcss')
const postcssSP = require('postcss-selector-parser')()
const postcssVP = require('postcss-value-parser')
const stylecow = require('stylecow-core')
const gonzales = require('gonzales')
const parserlib = require('parserlib')
const gonzalesPe = require('gonzales-pe')
const csstree = require('css-tree')
const Stylis = require('stylis')
const stylis = new Stylis()

module.exports = {
  name: 'Bootstrap',
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
        const root = postcss.parse(css, { from: example })
        root.walk(node => {
          if (node.type === 'rule') {
            node.selectorAST = postcssSP.process(node.selector)
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
        csstree.translate(csstree.parse(css))
      }
    },
    {
      name: 'ParserLib',
      fn: () => {
        (new parserlib.css.Parser()).parse(css)
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
        stylis('', css)
      }
    }
  ]
}

const devPath = path.join(__dirname, '../postcss/build/lib/postcss.js')
if (fs.existsSync(devPath)) {
  const devPostcss = require(devPath)
  module.exports.tests.splice(1, 0, {
    name: 'PostCSS dev',
    defer: true,
    fn: done => {
      devPostcss.parse(css, { from: example }).toResult()
      done.resolve()
    }
  })
}
