# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 10.4.1, Fedora 28, Intel Core i7-8550U,
16 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
Stylis:         13 ms  (2.7 times faster)
PostCSS:        35 ms
Rework:         38 ms  (1.1 times slower)
LibSass sync:   82 ms  (2.3 times slower)
Stylus:         87 ms  (2.5 times slower)
LibSass:        90 ms  (2.5 times slower)
Less:           91 ms  (2.6 times slower)
Dart Sass sync: 103 ms (2.9 times slower)
Dart Sass:      169 ms (4.8 times slower)
Stylecow:       199 ms (5.6 times slower)
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
CSSTree:      5 ms  (3.2 times faster)
Stylis:       6 ms  (2.8 times faster)
CSSOM:        14 ms (1.3 times faster)
PostCSS:      18 ms
Mensch:       21 ms (1.2 times slower)
Rework:       26 ms (1.5 times slower)
Stylecow:     41 ms (2.3 times slower)
PostCSS Full: 70 ms (3.9 times slower)
Gonzales:     92 ms (5.2 times slower)
Gonzales PE:  94 ms (5.3 times slower)
ParserLib:    96 ms (5.4 times slower)
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
Stylis:       9 ms   (4.0 times faster)
Autoprefixer: 34 ms
Stylecow:     157 ms (4.6 times slower)
nib:          176 ms (5.1 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
