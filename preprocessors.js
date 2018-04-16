/* Results on node 7.10.0, Fedora 25, Intel Core i7-6500U, 8 GB RAM and SSD:

Stylis:    30 ms   (1.6 times faster)
PostCSS:   49 ms
Rework:    67 ms   (1.4 times slower)
libsass:   100 ms  (2.1 times slower)
Stylus:    169 ms  (3.4 times slower)
Less:      171 ms  (3.5 times slower)
Stylecow:  298 ms  (6.1 times slower)
*/

const path = require('path');
const fs   = require('fs');

const example = path.join(__dirname, 'cache', 'bootstrap.css');
const origin  = fs.readFileSync(example).toString();
let i;

const css = origin
    .replace(/\s+filter:[^;\}]+;?/g, '')
    .replace('/*# sourceMappingURL=bootstrap.css.map */', '');

// PostCSS
const postcss   = require('postcss');
const processor = postcss([
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-calc'),
    require('postcss-mixins')
]);
let pcss = css;
pcss += '$size: 100px;';
pcss += '@define-mixin icon { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    pcss += 'body { h1 { a { color: black; } } }';
    pcss += 'h2 { width: $size; }';
    pcss += 'h1 { width: calc(2 * $size); }';
    pcss += '.search { fill: black; @mixin icon; }';
}

// Myth
const myth = require('myth');
let rcss = css;
rcss += ':root { --size: 100px; }';
for ( i = 0; i < 100; i++ ) {
    rcss += 'body h1 a { color: black; }';
    rcss += 'h2 { width: var(--size); }';
    rcss += 'h1 { width: calc(2 * var(--size)); }';
    rcss += '.search { fill: black; width: 16px; height: 16px; }';
}

// Stylecow
const stylecow    = require('stylecow-core');
const stylecowOut = new stylecow.Coder();
const stylecower  = new stylecow.Tasks();
stylecower.use(require('stylecow-plugin-nested-rules'));
stylecower.use(require('stylecow-plugin-variables'));
stylecower.use(require('stylecow-plugin-calc'));
let cowcss = css;
cowcss += ':root { --size: 100px; }';
for ( i = 0; i < 100; i++ ) {
    cowcss += 'body { h1 { a { color: black; } } }';
    cowcss += 'h2 { width: var(--size); }';
    cowcss += 'h1 { width: calc(2 * var(--size)); }';
    cowcss += '.search { fill: black; width: 16px; height: 16px; }';
}

// Sass
const libsass = require('node-sass');
let scss = css;
scss += '$size: 100px;';
scss += '@mixin icon { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    scss += 'body { h1 { a { color: black; } } }';
    scss += 'h2 { width: $size; }';
    scss += 'h1 { width: 2 * $size; }';
    scss += '.search { fill: black; @include icon; }';
}
const scssFile = path.join(__dirname, 'cache', 'bootstrap.preprocessors.scss');
fs.writeFileSync(scssFile, scss);

// Stylus
const stylus = require('stylus');
let styl = css;
styl += 'size = 100px;';
styl += 'icon() { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    styl += 'body { h1 { a { color: black; } } }';
    styl += 'h2 { width: size; }';
    styl += 'h1 { width: 2 * size; }';
    styl += '.search { fill: black; icon(); }';
}

// Less
const less = require('less');
let lcss = css;
lcss += '@size: 100px;';
lcss += '.icon() { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    lcss += 'body { h1 { a { color: black; } } }';
    lcss += 'h2 { width: @size; }';
    lcss += 'h1 { width: 2 * @size; }';
    lcss += '.search { fill: black; .icon() }';
}

// Stylis
const Stylis = require('stylis');
const stylisObj = new Stylis();
let styi = css;
styi += ':root { --size: 100px; }';
styi += '@mixin icon { width: 16px; height: 16px; }';
for ( i = 0; i < 100; i++ ) {
    styi += 'body h1 a { color: black; }';
    styi += 'h2 { width: var(--size); }';
    styi += 'h1 { width: calc(2 * var(--size)); }';
    styi += '.search { fill: black; @include icon; }';
}

stylisObj.use([
    require('stylis-mixin'),
    require('stylis-calc'),
    require('stylis-custom-properties')
]);

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'libsass',
            fn: () => {
                libsass.renderSync({ data: scss });
            }
        },
        {
            name: 'Rework',
            defer: true,
            fn: done => {
                myth(rcss, { features: { prefixes: false } });
                done.resolve();
            }
        },
        {
            name: 'PostCSS',
            defer: true,
            fn: done => {
                processor.process(pcss, { map: false }).then(() => {
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylecow',
            defer: true,
            fn: done => {
                const code = stylecow.parse(cowcss);
                stylecower.run(code);
                stylecowOut.run(code);
                done.resolve();
            }
        },
        {
            name: 'Stylus',
            defer: true,
            fn: done => {
                stylus.render(styl, { filename: example }, err => {
                    if ( err ) throw err;
                    done.resolve();
                });
            }
        },
        {
            name: 'Less',
            defer: true,
            fn: done => {
                less.render(lcss, err => {
                    if ( err ) throw err;
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylis',
            defer: true,
            fn: done => {
                stylisObj('', styi);
                done.resolve();
            }
        }
    ]
};

const devPath = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devPath) ) {
    const devPostcss   = require(devPath);
    const devProcessor = devPostcss([
        require('postcss-nested'),
        require('postcss-simple-vars'),
        require('postcss-calc'),
        require('postcss-mixins')
    ]);
    module.exports.tests.splice(2, 0, {
        name: 'PostCSS dev',
        defer: true,
        fn: done => {
            devProcessor.process(pcss, { map: false }).then(() => {
                done.resolve();
            });
        }
    });
}
