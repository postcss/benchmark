# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 5.3.0, Fedora 22, Intel 5Y70,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   39 ms
Rework:    73 ms   (1.9 times slower)
libsass:   77 ms   (1.9 times slower)
Less:      179 ms  (4.5 times slower)
Stylus:    269 ms  (6.8 times slower)
Stylecow:  271 ms  (6.9 times slower)
Ruby Sass: 1101 ms (28.0 times slower)
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
Mensch:      30 ms  (1.2 times faster)
CSSOM:       33 ms  (1.1 times faster)
PostCSS:     37 ms
Rework:      51 ms  (1.4 times slower)
Stylecow:    100 ms (2.7 times slower)
Gonzales:    158 ms (4.3 times slower)
Gonzales PE: 163 ms (4.4 times slower)
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
Stylecow:     215 ms  (4.7 times slower)
nib:          470 ms  (10.4 times slower)
Compass:      2475 ms (54.5 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
