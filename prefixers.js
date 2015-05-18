/* Results on Fedora 21, Intel 5Y70, 8 GB RAM and SSD:

Autoprefixer: 59 ms
Stylecow:     285 ms  (4.8 times slower)
nib:          403 ms  (6.8 times slower)
Compass:      2564 ms (43.2 times slower)
*/

var exec = require('child_process').exec;
var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();

// Autoprefixer
var autoprefixer = require('autoprefixer-core');
var postcss      = require('postcss');

css = postcss([ autoprefixer({ browsers: [] }) ]).process(css).css;
var processor = postcss([ autoprefixer ]);

// Stylecow
var stylecow = require('stylecow');
stylecow.loadPlugin('prefixes');

// nib
var stylus = require('stylus');
var styl = "@import 'nib';\n" + css
    .replace('@charset "UTF-8";', '')
    .replace(/\}/g, '}\n').replace(/(\w)\[[^\]]+\]/g, '$1')
    .replace(/filter:[^;}]+;?/ig, '')
    .replace(/(@keyframes[^\{]+)\{/ig, '$1 {')
    .replace(/url\([^\)]+\)/ig, 'white');

// Compass
var scss = "@import 'compass/css3';\n" + css
    .replace(/([^-])transform:([^;}]+)(;|})/g, '$1@include transform($2)$3')
    .replace(/transition:([^;}]+)(;|})/g, '@include transition($1)$2')
    .replace(/background(-image)?:((linear|radial)([^;}]+))(;|})/g,
            '@include background($2)$5')
    .replace(/box-sizing:([^;}]+)(;|})/g, '@include box-sizing($1)$2');
var scssFile = path.join(__dirname, 'cache/bootstrap.scss');
fs.writeFileSync(scssFile, scss);

module.exports = {
    name:   'Bootstrap',
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
                var file = new stylecow.Reader(new stylecow.Tokens(css));
                var ast  = stylecow.Root.create(file);
                stylecow.run(ast);
                ast.toString();
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
                var dir = __dirname;
                exec('cd ' + dir + '; bundle exec ' + command,
                    function (error, stdout, stderr) {
                        if ( error ) throw stderr;
                        done.resolve();
                    });
            }
        }
    ]
};
