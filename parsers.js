/* Results on node 6.3.0, Fedora 23, Intel Core i7-6500U, 8 GB RAM and SSD:

Mensch:      24 ms  (1.5 times faster)
CSSOM:       25 ms  (1.4 times faster)
PostCSS:     37 ms
Rework:      47 ms  (1.3 times slower)
Stylecow:    74 ms  (2.0 times slower)
Gonzales:    113 ms (3.1 times slower)
Gonzales PE: 138 ms (3.8 times slower)
ParserLib:   251 ms (6.8 times slower)
*/

var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();

var CSSOM      = require('cssom');
var rework     = require('rework');
var mensch     = require('mensch');
var postcss    = require('postcss');
var stylecow   = require('stylecow-core');
var gonzales   = require('gonzales');
var parserlib  = require('parserlib');
var gonzalesPe = require('gonzales-pe');

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
