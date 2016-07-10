# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 6.3.0, Fedora 23, Intel Core i7-6500U,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   40 ms
libsass:   77 ms  (1.9 times slower)
Rework:    87 ms  (2.2 times slower)
Less:      159 ms (4.0 times slower)
Stylus:    224 ms (5.7 times slower)
Stylecow:  232 ms (5.9 times slower)
Ruby Sass: 872 ms (22.0 times slower)
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
Mensch:      24 ms  (1.5 times faster)
CSSOM:       25 ms  (1.4 times faster)
PostCSS:     37 ms
Rework:      47 ms  (1.3 times slower)
Stylecow:    74 ms  (2.0 times slower)
Gonzales:    113 ms (3.1 times slower)
Gonzales PE: 138 ms (3.8 times slower)
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
Autoprefixer: 48 ms
Stylecow:     197 ms  (4.1 times slower)
nib:          409 ms  (8.5 times slower)
Compass:      2398 ms (50.1 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
