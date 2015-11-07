# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 5.0.0, Fedora 22, Intel 5Y70,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   40 ms
Rework:    75 ms   (1.9 times slower)
libsass:   76 ms   (1.9 times slower)
Less:      147 ms  (3.7 times slower)
Stylus:    166 ms  (4.1 times slower)
Stylecow:  258 ms  (6.4 times slower)
Ruby Sass: 1042 ms (26.0 times slower)
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
Mensch:      28 ms  (1.3 times faster)
CSSOM:       34 ms  (1.1 times faster)
PostCSS:     36 ms
Rework:      51 ms  (1.4 times slower)
Stylecow:    102 ms (2.8 times slower)
Gonzales:    159 ms (4.4 times slower)
Gonzales PE: 178 ms (4.9 times slower)
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
Autoprefixer: 45 ms
Stylecow:     200 ms  (4.5 times slower)
nib:          381 ms  (8.5 times slower)
Compass:      2451 ms (54.5 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
