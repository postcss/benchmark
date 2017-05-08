# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 7.10.0, Fedora 25, Intel Core i7-6500U,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   39 ms
Rework:    68 ms   (1.8 times slower)
libsass:   100 ms  (2.6 times slower)
Less:      134 ms  (3.5 times slower)
Stylus:    171 ms  (4.4 times slower)
Stylecow:  296 ms  (7.6 times slower)
Ruby Sass: 1692 ms (43.6 times slower)
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
CSSTree:      6 ms   (4.9 times faster)
PostCSS:      29 ms
CSSOM:        29 ms  (1.0 times slower)
Mensch:       31 ms  (1.1 times slower)
Rework:       49 ms  (1.7 times slower)
PostCSS Full: 75 ms  (2.6 times slower)
Gonzales:     116 ms (4.0 times slower)
Stylecow:     140 ms (4.8 times slower)
Gonzales PE:  150 ms (5.1 times slower)
ParserLib:    316 ms (10.8 times slower)
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
Autoprefixer: 51 ms
Stylecow:     294 ms  (5.7 times slower)
nib:          313 ms  (6.1 times slower)
Compass:      3298 ms (64.4 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
