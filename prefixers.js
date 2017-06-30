/* Results on node 7.10.0, Fedora 25, Intel Core i7-6500U, 8 GB RAM and SSD:

Autoprefixer: 51 ms
Stylecow:     294 ms  (5.7 times slower)
nib:          313 ms  (6.1 times slower)
Compass:      3298 ms (64.4 times slower)
*/

var exec = require('child_process').exec;
var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();

// Autoprefixer
var autoprefixer = require('autoprefixer');
var postcss      = require('postcss');

css = postcss([ autoprefixer({ browsers: [] }) ]).process(css).css;
var processor = postcss([ autoprefixer ]);

// Stylecow
var stylecow    = require('stylecow-core');
var stylecowOut = new stylecow.Coder();
var stylecower  = new stylecow.Tasks();
stylecower.use(require('stylecow-plugin-prefixes'));

// nib
var stylus = require('stylus');
var styl = '@import \'nib\';\n' + css
    .replace('@charset "UTF-8";', '')
    .replace(/\}/g, '}\n').replace(/(\w)\[[^\]]+\]/g, '$1')
    .replace(/filter:[^;}]+;?/ig, '')
    .replace(/(@keyframes[^\{]+)\{/ig, '$1 {')
    .replace(/url\([^\)]+\)/ig, 'white');

// Compass
var scss = '@import \'compass/css3\';\n' + css
    .replace(/([^-])transform:([^;}]+)(;|})/g, '$1@include transform($2)$3')
    .replace(/transition:([^;}]+)(;|})/g, '@include transition($1)$2')
    .replace(
        /background(-image)?:((linear|radial)([^;}]+))(;|})/g,
        '@include background($2)$5'
    )
    .replace(/box-sizing:([^;}]+)(;|})/g, '@include box-sizing($1)$2');
var scssFile = path.join(__dirname, 'cache/bootstrap.prefixers.scss');
fs.writeFileSync(scssFile, scss);

// Stylis
var Stylis = require('stylis');
var stylis = new Stylis();

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'Autoprefixer',
            defer: true,
            fn: function (done) {
                processor.process(css, { map: false }).then(function () {
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylecow',
            defer: true,
            fn: function (done) {
                var code = stylecow.parse(css);
                stylecower.run(code);
                stylecowOut.run(code);
                done.resolve();
            }
        },
        {
            name: 'nib',
            defer: true,
            fn: function (done) {
                stylus(styl)
                    .include(require('nib').path)
                    .render(function (err) {
                        if ( err ) throw err;
                        done.resolve();
                    });
            }
        },
        {
            name: 'Compass',
            defer: true,
            fn: function (done) {
                var command = 'sass -C --compass --sourcemap=none ' + scssFile;
                exec('bundle exec ' + command, function (err, stdout, stderr) {
                    if ( err ) throw stderr;
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylis',
            defer: true,
            fn: function (done) {
                stylis('', css);
                done.resolve();
            }
        }
    ]
};

var devA = path.join(__dirname, '../autoprefixer/build/lib/autoprefixer.js');
var devP = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devA) && fs.existsSync(devP) ) {
    var devAutoprefixer = require(devA);
    var devPostcss      = require(devP);
    var devProcessor    = devPostcss([devAutoprefixer]);
    module.exports.tests.splice(0, 0, {
        name: 'Autoprefixer dev',
        defer: true,
        fn: function (done) {
            devProcessor.process(css, { map: false }).then(function () {
                done.resolve();
            });
        }
    });
}
