# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 7.5.0, Fedora 25, Intel Core i7-6500U,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   45 ms
Rework:    64 ms   (1.4 times slower)
libsass:   101 ms  (2.2 times slower)
Less:      136 ms  (3.0 times slower)
Stylus:    175 ms  (3.9 times slower)
Stylecow:  291 ms  (6.5 times slower)
Ruby Sass: 1731 ms (38.7 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test preprocessors
```

[CSS processors]: https://github.com/postcss/benchmark/blob/master/preprocessors.js

## Parsers

Compare [CSS parsers] written on JS:

```
CSSTree:      6 ms   (4.7 times faster)
PostCSS:      27 ms
CSSOM:        28 ms  (1.0 times slower)
Mensch:       31 ms  (1.1 times slower)
Rework:       45 ms  (1.6 times slower)
PostCSS Full: 73 ms  (2.6 times slower)
Gonzales:     119 ms (4.3 times slower)
Stylecow:     138 ms (5.0 times slower)
Gonzales PE:  148 ms (5.4 times slower)
ParserLib:    302 ms (11.0 times slower)
```

To get results on your environment:

```sh
npm install
npm test parsers
```

[CSS parsers]: https://github.com/postcss/benchmark/blob/master/parsers.js

## Prefixers

Compare [vendor prefixes tools]:

```
Autoprefixer: 47 ms
Stylecow:     274 ms  (5.8 times slower)
nib:          326 ms  (6.9 times slower)
Compass:      3313 ms (70.2 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
