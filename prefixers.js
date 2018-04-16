/* Results on node 9.11.1, Fedora 28, Intel Core i7-8550U, 16 GB RAM and SSD:

Stylis:       11 ms  (2.8 times faster)
Autoprefixer: 32 ms
Stylecow:     122 ms (3.8 times slower)
nib:          196 ms (6.1 times slower)
*/

const path = require('path');
const fs   = require('fs');

const example = path.join(__dirname, 'cache', 'bootstrap.css');
const origin  = fs.readFileSync(example).toString();

// Autoprefixer
const autoprefixer = require('autoprefixer');
const postcss      = require('postcss');

const css = postcss([ autoprefixer({ browsers: [] }) ]).process(origin).css;
const processor = postcss([ autoprefixer ]);

// Stylecow
const stylecow    = require('stylecow-core');
const stylecowOut = new stylecow.Coder();
const stylecower  = new stylecow.Tasks();
stylecower.use(require('stylecow-plugin-prefixes'));

// nib
const stylus = require('stylus');
const styl = '@import \'nib\';\n' + css
    .replace('@charset "UTF-8";', '')
    .replace(/\}/g, '}\n').replace(/(\w)\[[^\]]+\]/g, '$1')
    .replace(/filter:[^;}]+;?/ig, '')
    .replace(/(@keyframes[^\{]+)\{/ig, '$1 {')
    .replace(/url\([^\)]+\)/ig, 'white');

// Compass
const scss = '@import \'compass/css3\';\n' + css
    .replace(/([^-])transform:([^;}]+)(;|})/g, '$1@include transform($2)$3')
    .replace(/transition:([^;}]+)(;|})/g, '@include transition($1)$2')
    .replace(
        /background(-image)?:((linear|radial)([^;}]+))(;|})/g,
        '@include background($2)$5'
    )
    .replace(/box-sizing:([^;}]+)(;|})/g, '@include box-sizing($1)$2');
const scssFile = path.join(__dirname, 'cache/bootstrap.prefixers.scss');
fs.writeFileSync(scssFile, scss);

// Stylis
const Stylis = require('stylis');
const stylis = new Stylis();

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'Autoprefixer',
            defer: true,
            fn: done => {
                processor.process(css, {
                    from: example, map: false
                }).then(() => {
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylecow',
            defer: true,
            fn: done => {
                const code = stylecow.parse(css);
                stylecower.run(code);
                stylecowOut.run(code);
                done.resolve();
            }
        },
        {
            name: 'nib',
            defer: true,
            fn: done => {
                stylus(styl)
                    .include(require('nib').path)
                    .render(err => {
                        if ( err ) throw err;
                        done.resolve();
                    });
            }
        },
        {
            name: 'Stylis',
            defer: true,
            fn: done => {
                stylis('', css);
                done.resolve();
            }
        }
    ]
};

const devA = path.join(__dirname, '../autoprefixer/build/lib/autoprefixer.js');
const devP = path.join(__dirname, '../postcss/build/lib/postcss.js');
if ( fs.existsSync(devA) && fs.existsSync(devP) ) {
    const devAutoprefixer = require(devA);
    const devPostcss      = require(devP);
    const devProcessor    = devPostcss([devAutoprefixer]);
    module.exports.tests.splice(0, 0, {
        name: 'Autoprefixer dev',
        defer: true,
        fn: done => {
            devProcessor.process(css, {
                from: example, map: false
            }).then(() => {
                done.resolve();
            });
        }
    });
}
