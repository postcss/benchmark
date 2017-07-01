/* Results on node 7.10.0, Fedora 25, Intel Core i7-6500U, 8 GB RAM and SSD:

CSSTree:      6 ms   (4.8 times faster)
Stylis:       12 ms  (2.3 times faster)
PostCSS:      29 ms
CSSOM:        29 ms  (1.0 times slower)
Mensch:       31 ms  (1.1 times slower)
Rework:       51 ms  (1.8 times slower)
PostCSS Full: 72 ms  (2.5 times slower)
Gonzales:     113 ms (3.9 times slower)
Stylecow:     143 ms (5.0 times slower)
Gonzales PE:  156 ms (5.4 times slower)
ParserLib:    344 ms (11.9 times slower)
*/

const path = require('path');
const fs   = require('fs');

const example = path.join(__dirname, 'cache', 'bootstrap.css');
const css     = fs.readFileSync(example).toString();

const CSSOM      = require('cssom');
const rework     = require('rework');
const mensch     = require('mensch');
const postcss    = require('postcss');
const postcssSP  = require('postcss-selector-parser')();
const postcssVP  = require('postcss-value-parser');
const stylecow   = require('stylecow-core');
const gonzales   = require('gonzales');
const parserlib  = require('parserlib');
const gonzalesPe = require('gonzales-pe');
const csstree    = require('css-tree');
const Stylis     = require('stylis');
const stylis     = new Stylis();

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'Rework',
            fn: () => {
                rework(css).toString();
            }
        },
        {
            name: 'PostCSS',
            defer: true,
            fn: done => {
                postcss.parse(css, { from: example }).toResult();
                done.resolve();
            }
        },
        {
            name: 'PostCSS Full',
            defer: true,
            fn: done => {
                const root = postcss.parse(css, { from: example });
                root.walk(node => {
                    if ( node.type === 'rule' ) {
                        node.selector = postcssSP.process(node.selector);
                    } else if ( node.type === 'decl' ) {
                        node.value = postcssVP(node.value);
                    }
                });
                root.toResult();
                done.resolve();
            }
        },
        {
            name: 'CSSOM',
            fn: () => {
                CSSOM.parse(css).toString();
            }
        },
        {
            name: 'Mensch',
            fn: () => {
                mensch.stringify( mensch.parse(css) );
            }
        },
        {
            name: 'Gonzales',
            fn: () => {
                gonzales.csspToSrc( gonzales.srcToCSSP(css) );
            }
        },
        {
            name: 'Gonzales PE',
            fn: () => {
                gonzalesPe.parse(css).toString();
            }
        },
        {
            name: 'CSSTree',
            fn: () => {
                csstree.translate(csstree.parse(css));
            }
        },
        {
            name: 'ParserLib',
            fn: () => {
                (new parserlib.css.Parser()).parse(css);
            }
        },
        {
            name: 'Stylecow',
            fn: () => {
                stylecow.parse(css).toString();
            }
        },
        {
            name: 'Stylis',
            fn: () => {
                stylis('', css);
            }
        }
    ]
};

const devPath = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devPath) ) {
    const devPostcss = require(devPath);
    module.exports.tests.splice(1, 0, {
        name: 'PostCSS dev',
        defer: true,
        fn: done => {
            devPostcss.parse(css, { from: example }).toResult();
            done.resolve();
        }
    });
}
