# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on Node 15.2.1, Fedora 33, Intel Core i7-1065G7,
and 16 GB RAM:

[PostCSS]: https://github.com/postcss/postcss


## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
Rework:         33 ms  (1.2 times faster)
PostCSS sync:   36 ms  (1.1 times faster)
PostCSS:        38 ms
Dart Sass sync: 66 ms  (1.7 times slower)
LibSass sync:   68 ms  (1.8 times slower)
LibSass:        69 ms  (1.8 times slower)
Dart Sass:      130 ms (3.4 times slower)
Less:           256 ms (6.7 times slower)
```

To get results on your environment:

```sh
npm install
npm test preprocessors
```

[CSS processors]: https://github.com/postcss/benchmark/blob/main/preprocessors.js


## Parsers

Compare [CSS parsers] written on JS:

```
Stylis:       5 ms  (3.1 times faster)
CSSTree:      9 ms  (1.7 times faster)
PostCSS:      16 ms
CSSOM:        18 ms (1.2 times slower)
Mensch:       21 ms (1.3 times slower)
Rework:       27 ms (1.7 times slower)
Stylecow:     39 ms (2.5 times slower)
PostCSS Full: 67 ms (4.3 times slower)
ParserLib:    74 ms (4.7 times slower)
Gonzales:     74 ms (4.7 times slower)
Gonzales PE:  82 ms (5.2 times slower)
```

To get results on your environment:

```sh
npm install
npm test parsers
```

[CSS parsers]: https://github.com/postcss/benchmark/blob/main/parsers.js


## Prefixers

Compare [vendor prefixes tools]:

```
Stylis:       8 ms   (5.1 times faster)
Autoprefixer: 42 ms
Stylecow:     343 ms (8.2 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/main/prefixers.js
