/* Results on node 10.4.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

CSSTree:      5 ms  (3.2 times faster)
Stylis:       6 ms  (2.8 times faster)
CSSOM:        14 ms (1.3 times faster)
PostCSS:      18 ms
Mensch:       21 ms (1.2 times slower)
Rework:       26 ms (1.5 times slower)
Stylecow:     41 ms (2.3 times slower)
PostCSS Full: 70 ms (3.9 times slower)
Gonzales:     92 ms (5.2 times slower)
Gonzales PE:  94 ms (5.3 times slower)
ParserLib:    96 ms (5.4 times slower)
*/

let gonzalesPe = require('gonzales-pe')
let postcssSP = require('postcss-selector-parser')
let postcssVP = require('postcss-value-parser')
let parserlib = require('parserlib')
let stylecow = require('stylecow-core')
let gonzales = require('gonzales')
let csstree = require('css-tree')
let postcss = require('postcss')
let rework = require('rework')
let mensch = require('mensch')
let Stylis = require('stylis')
let CSSOM = require('cssom')
let path = require('path')
let fs = require('fs')

let example = path.join(__dirname, 'cache', 'bootstrap.css')
let css = fs.readFileSync(example).toString()

let stylis = new Stylis()

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

let devPath = path.join(__dirname, '../postcss')
if (fs.existsSync(devPath)) {
  let devPostcss = require(devPath)
  module.exports.tests.splice(1, 0, {
    name: 'PostCSS dev',
    defer: true,
    fn: done => {
      devPostcss.parse(css, { from: example }).toResult()
      done.resolve()
    }
  })
}
