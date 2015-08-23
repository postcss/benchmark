/* Results on io.js 2.4, Fedora 21, Intel 5Y70, 8 GB RAM and SSD:

CSSOM:       28 ms  (1.2 times faster)
PostCSS:     34 ms
Mensch:      36 ms  (1.1 times slower)
Rework:      50 ms  (1.5 times slower)
Stylecow:    99 ms  (2.4 times slower)
Gonzales:    153 ms (4.5 times slower)
Gonzales PE: 166 ms (4.1 times slower)
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
            name: 'Stylecow',
            fn: function () {
                stylecow.parse(css).toString()
            }
        }
    ]
};
