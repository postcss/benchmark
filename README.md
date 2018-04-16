# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 9.11.1, Fedora 28, Intel Core i7-8550U,
16 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
Stylis:   18 ms  (2.2 times faster)
PostCSS:  41 ms
Rework:   46 ms  (1.1 times slower)
libsass:  81 ms  (2.0 times slower)
Less:     106 ms (2.6 times slower)
Stylus:   108 ms (2.6 times slower)
Stylecow: 155 ms (3.8 times slower)
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
CSSTree:      5 ms   (3.3 times faster)
Stylis:       9 ms   (1.9 times faster)
CSSOM:        12 ms  (1.3 times faster)
PostCSS:      16 ms
Mensch:       22 ms  (1.4 times slower)
Rework:       30 ms  (1.8 times slower)
Stylecow:     41 ms  (2.6 times slower)
PostCSS Full: 52 ms  (3.2 times slower)
Gonzales:     81 ms  (5.0 times slower)
Gonzales PE:  94 ms  (5.8 times slower)
ParserLib:    140 ms (8.7 times slower)
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
Stylis:       11 ms  (2.8 times faster)
Autoprefixer: 32 ms
Stylecow:     122 ms (3.8 times slower)
nib:          196 ms (6.1 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
