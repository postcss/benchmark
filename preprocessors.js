/* Results on node 6.3.0, Fedora 23, Intel Core i7-6500U, 8 GB RAM and SSD:

PostCSS:   40 ms
libsass:   77 ms  (1.9 times slower)
Rework:    87 ms  (2.2 times slower)
Less:      159 ms (4.0 times slower)
Stylus:    224 ms (5.7 times slower)
Stylecow:  232 ms (5.9 times slower)
Ruby Sass: 872 ms (22.0 times slower)
*/

var exec = require('child_process').exec;
var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();
var i;

css = css.replace(/\s+filter:[^;\}]+;?/g, '');
css = css.replace('/*# sourceMappingURL=bootstrap.css.map */', '');

// PostCSS
var postcss   = require('postcss');
var processor = postcss([
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-calc'),
    require('postcss-mixins')
]);
var pcss = css;
pcss += '$size: 100px;';
pcss += '@define-mixin icon { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    pcss += 'body { h1 { a { color: black; } } }';
    pcss += 'h2 { width: $size; }';
    pcss += 'h1 { width: calc(2 * $size); }';
    pcss += '.search { fill: black; @mixin icon; }';
}

// Myth
var myth = require('myth');
var rcss = css;
rcss += ':root { --size: 100px; }';
for ( i = 0; i < 100; i++ ) {
    rcss += 'body h1 a { color: black; }';
    rcss += 'h2 { width: var(--size); }';
    rcss += 'h1 { width: calc(2 * var(--size)); }';
    rcss += '.search { fill: black; width: 16px; height: 16px; }';
}

// Stylecow
var stylecow    = require('stylecow-core');
var stylecowOut = new stylecow.Coder();
var stylecower  = new stylecow.Tasks();
stylecower.use(require('stylecow-plugin-nested-rules'));
stylecower.use(require('stylecow-plugin-variables'));
stylecower.use(require('stylecow-plugin-calc'));
var cowcss = css;
cowcss += ':root { --size: 100px; }';
for ( i = 0; i < 100; i++ ) {
    cowcss += 'body { h1 { a { color: black; } } }';
    cowcss += 'h2 { width: var(--size); }';
    cowcss += 'h1 { width: calc(2 * var(--size)); }';
    cowcss += '.search { fill: black; width: 16px; height: 16px; }';
}

// Sass
var libsass = require('node-sass');
var scss = css;
scss += '$size: 100px;';
scss += '@mixin icon { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    scss += 'body { h1 { a { color: black; } } }';
    scss += 'h2 { width: $size; }';
    scss += 'h1 { width: 2 * $size; }';
    scss += '.search { fill: black; @include icon; }';
}
var scssFile = path.join(__dirname, 'cache', 'bootstrap.preprocessors.scss');
fs.writeFileSync(scssFile, scss);

// Stylus
var stylus = require('stylus');
var styl = css;
styl += 'size = 100px;';
styl += 'icon() { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    styl += 'body { h1 { a { color: black; } } }';
    styl += 'h2 { width: size; }';
    styl += 'h1 { width: 2 * size; }';
    styl += '.search { fill: black; icon(); }';
}

// Less
var less = require('less');
var lcss = css;
lcss += '@size: 100px;';
lcss += '.icon() { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    lcss += 'body { h1 { a { color: black; } } }';
    lcss += 'h2 { width: @size; }';
    lcss += 'h1 { width: 2 * @size; }';
    lcss += '.search { fill: black; .icon() }';
}

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'libsass',
            fn: function () {
                libsass.renderSync({ data: scss });
            }
        },
        {
            name: 'Rework',
            defer: true,
            fn: function (done) {
                myth(rcss, { features: { prefixes: false } });
                done.resolve();
            }
        },
        {
            name: 'PostCSS',
            defer: true,
            fn: function (done) {
                processor.process(pcss, { map: false }).then(function () {
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylecow',
            defer: true,
            fn: function (done) {
                var code = stylecow.parse(cowcss);
                stylecower.run(code);
                stylecowOut.run(code);
                done.resolve();
            }
        },
        {
            name: 'Stylus',
            defer: true,
            fn: function (done) {
                stylus.render(styl, { filename: example }, function (err) {
                    if ( err ) throw err;
                    done.resolve();
                });
            }
        },
        {
            name: 'Less',
            defer: true,
            fn: function (done) {
                less.render(lcss, function (err) {
                    if ( err ) throw err;
                    done.resolve();
                });
            }
        },
        {
            name: 'Ruby Sass',
            defer: true,
            fn: function (done) {
                var command = 'sass -C --sourcemap=none ' + scssFile;
                exec('bundle exec ' + command, function (err, stdout, stderr) {
                    if ( err ) throw stderr;
                    done.resolve();
                });
            }
        }
    ]
};

var devPath = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devPath) ) {
    var devPostcss   = require(devPath);
    var devProcessor = devPostcss([
        require('postcss-nested'),
        require('postcss-simple-vars'),
        require('postcss-calc'),
        require('postcss-mixins')
    ]);
    module.exports.tests.splice(2, 0, {
        name: 'PostCSS dev',
        defer: true,
        fn: function (done) {
            devProcessor.process(pcss, { map: false }).then(function () {
                done.resolve();
            });
        }
    });
}
