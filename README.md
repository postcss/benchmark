# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on Node 14.10.1, Fedora 32, Intel Core i7-1065G7,
16 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss


## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS sync:   27 ms  (1.1 times faster)
PostCSS:        30 ms
Rework:         33 ms  (1.1 times slower)
LibSass sync:   64 ms  (2.1 times slower)
LibSass:        66 ms  (2.2 times slower)
Dart Sass sync: 77 ms  (2.6 times slower)
Dart Sass:      138 ms (4.5 times slower)
Less:           410 ms (13.5 times slower)
```

To get results on your environment:

```sh
npm install
npm test preprocessors
```

[CSS processors]: https://github.com/postcss/benchmark/blob/master/preprocessors.js


## Parsers

Compare [CSS parsers] written on JS:

```
CSSTree:      4 ms  (3.9 times faster)
Stylis:       4 ms  (3.5 times faster)
PostCSS:      15 ms
CSSOM:        16 ms (1.1 times slower)
Mensch:       18 ms (1.2 times slower)
Rework:       25 ms (1.7 times slower)
Stylecow:     38 ms (2.6 times slower)
PostCSS Full: 63 ms (4.3 times slower)
Gonzales:     76 ms (5.1 times slower)
ParserLib:    78 ms (5.2 times slower)
Gonzales PE:  88 ms (5.9 times slower)
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
Autoprefixer: 32 ms
Stylecow:     187 ms (5.9 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js


## PostCSS APIs

Compare different way to write plugins for PostCSS:

```
Walk sync API      0.60 ops/sec
Visitor sync API   0.79 ops/sec
Walk async API     0.54 ops/sec
Visitor async API  0.63 ops/sec
```

To get results on your environment:

```sh
npm install
bundle install
npm test apis
```
