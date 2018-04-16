# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 9.11.1, Fedora 28, Intel Core i7-8550U,
16 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
Stylis:   16 ms  (1.9 times faster)
PostCSS:  31 ms
Rework:   44 ms  (1.4 times slower)
libsass:  66 ms  (2.1 times slower)
Less:     102 ms (3.3 times slower)
Stylus:   108 ms (3.5 times slower)
Stylecow: 162 ms (5.2 times slower)
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
CSSTree:      7 ms   (2.2 times faster)
Stylis:       10 ms  (1.6 times faster)
CSSOM:        13 ms  (1.2 times faster)
PostCSS:      16 ms
Mensch:       22 ms  (1.4 times slower)
Rework:       30 ms  (1.9 times slower)
Stylecow:     42 ms  (2.7 times slower)
PostCSS Full: 45 ms  (2.9 times slower)
Gonzales PE:  91 ms  (5.8 times slower)
Gonzales:     92 ms  (5.9 times slower)
ParserLib:    143 ms (9.1 times slower)
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
Stylis:       12 ms  (2.8 times faster)
Autoprefixer: 35 ms
Stylecow:     121 ms (3.5 times slower)
nib:          195 ms (5.6 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
