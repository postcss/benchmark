/* Results on node 6.6.0, Fedora 23, Intel Core i7-6500U, 8 GB RAM and SSD:

CSSTree:      14 ms  (1.8 times faster)
Mensch:       21 ms  (1.2 times faster)
CSSOM:        25 ms  (1.0 times faster)
PostCSS:      25 ms
Rework:       49 ms  (1.9 times slower)
PostCSS Full: 69 ms  (2.7 times slower)
Stylecow:     102 ms (4.0 times slower)
Gonzales:     108 ms (4.3 times slower)
Gonzales PE:  134 ms (5.3 times slower)
ParserLib:    282 ms (11.1 times slower)
*/

var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();

var CSSOM      = require('cssom');
var rework     = require('rework');
var mensch     = require('mensch');
var postcss    = require('postcss');
var postcssSP  = require('postcss-selector-parser')();
var postcssVP  = require('postcss-value-parser');
var stylecow   = require('stylecow-core');
var gonzales   = require('gonzales');
var parserlib  = require('parserlib');
var gonzalesPe = require('gonzales-pe');
var csstree    = require('css-tree');

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'Rework',
            fn: function () {
                rework(css).toString();
            }
        },
        {
            name: 'PostCSS',
            defer: true,
            fn: function (done) {
                postcss.parse(css, { from: example }).toResult();
                done.resolve();
            }
        },
        {
            name: 'PostCSS Full',
            defer: true,
            fn: function (done) {
                let root = postcss.parse(css, { from: example });
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
            fn: function () {
                CSSOM.parse(css).toString();
            }
        },
        {
            name: 'Mensch',
            fn: function () {
                mensch.stringify( mensch.parse(css) );
            }
        },
        {
            name: 'Gonzales',
            fn: function () {
                gonzales.csspToSrc( gonzales.srcToCSSP(css) );
            }
        },
        {
            name: 'Gonzales PE',
            fn: function () {
                gonzalesPe.parse(css).toString();
            }
        },
        {
            name: 'CSSTree',
            fn: function () {
                csstree.translate(csstree.parse(css));
            }
        },
        {
            name: 'ParserLib',
            fn: function () {
                (new parserlib.css.Parser()).parse(css);
            }
        },
        {
            name: 'Stylecow',
            fn: function () {
                stylecow.parse(css).toString();
            }
        }
    ]
};

var devPath = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devPath) ) {
    var devPostcss = require(devPath);
    module.exports.tests.splice(1, 0, {
        name: 'PostCSS dev',
        defer: true,
        fn: function (done) {
            devPostcss.parse(css, { from: example }).toResult();
            done.resolve();
        }
    });
}
