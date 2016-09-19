# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 6.6.0, Fedora 23, Intel Core i7-6500U,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   42 ms
Rework:    68 ms  (1.6 times slower)
libsass:   77 ms  (1.9 times slower)
Less:      142 ms (3.4 times slower)
Stylus:    200 ms (4.8 times slower)
Stylecow:  259 ms (6.2 times slower)
Ruby Sass: 877 ms (21.0 times slower)
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
CSSTree:      14 ms  (1.8 times faster)
Mensch:       21 ms  (1.2 times faster)
CSSOM:        25 ms  (1.0 times faster)
PostCSS:      25 ms
Rework:       49 ms  (1.9 times slower)
PostCSS Full: 69 ms  (2.7 times slower)
Stylecow:     102 ms (4.0 times slower)
Gonzales:     108 ms (4.3 times slower)
Gonzales PE:  134 ms (5.3 times slower)
ParserLib:    282 ms (11.1 times slower)
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
Autoprefixer: 44 ms
Stylecow:     200 ms  (4.5 times slower)
nib:          340 ms  (7.7 times slower)
Compass:      2417 ms (54.9 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
