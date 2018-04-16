# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 7.10.0, Fedora 25, Intel Core i7-6500U,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
Stylis:    30 ms   (1.6 times faster)
PostCSS:   49 ms
Rework:    67 ms   (1.4 times slower)
libsass:   100 ms  (2.1 times slower)
Stylus:    169 ms  (3.4 times slower)
Less:      171 ms  (3.5 times slower)
Stylecow:  298 ms  (6.1 times slower)
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
CSSTree:      6 ms   (4.8 times faster)
Stylis:       12 ms  (2.3 times faster)
PostCSS:      29 ms
CSSOM:        29 ms  (1.0 times slower)
Mensch:       31 ms  (1.1 times slower)
Rework:       51 ms  (1.8 times slower)
PostCSS Full: 72 ms  (2.5 times slower)
Gonzales:     113 ms (3.9 times slower)
Stylecow:     143 ms (5.0 times slower)
Gonzales PE:  156 ms (5.4 times slower)
ParserLib:    344 ms (11.9 times slower)
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
Stylis:       15 ms   (3.5 times faster)
Autoprefixer: 53 ms
nib:          282 ms  (5.4 times slower)
Stylecow:     291 ms  (5.5 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
