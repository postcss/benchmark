# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on node 4.2.1, Fedora 22, Intel 5Y70,
8 GB RAM and SSD:

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   60 ms
libsass:   74 ms   (1.2 times slower)
Rework:    74 ms   (1.2 times slower)
Less:      161 ms  (2.7 times slower)
Stylus:    174 ms  (2.9 times slower)
Stylecow:  262 ms  (4.4 times slower)
Ruby Sass: 1033 ms (17.3 times slower)
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
Mensch:      28 ms  (1.4 times faster)
CSSOM:       31 ms  (1.3 times faster)
PostCSS:     41 ms
Rework:      54 ms  (1.3 times slower)
Stylecow:    108 ms (2.7 times slower)
Gonzales:    166 ms (4.1 times slower)
Gonzales PE: 173 ms (4.2 times slower)
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
Autoprefixer: 67 ms
Stylecow:     216 ms  (3.2 times slower)
nib:          402 ms  (6.0 times slower)
Compass:      2491 ms (37.0 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
