# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on Fedora 21, Intel 5Y70, 8 GB RAM and SSD.

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS:   61 ms
Rework:    72 ms   (1.2 times slower)
libsass:   129 ms  (2.1 times slower)
Less:      152 ms  (2.5 times slower)
Stylus:    161 ms  (2.6 times slower)
Stylecow:  171 ms  (2.8 times slower)
Ruby Sass: 1042 ms (17.0 times slower)
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
CSSOM:       28 ms  (1.2 times faster)
PostCSS:     34 ms
Mensch:      36 ms  (1.1 times slower)
Rework:      50 ms  (1.5 times slower)
Stylecow:    99 ms  (2.4 times slower)
Gonzales:    153 ms (4.5 times slower)
Gonzales PE: 166 ms (4.1 times slower)
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
Autoprefixer: 59 ms
Stylecow:     285 ms  (4.8 times slower)
nib:          403 ms  (6.8 times slower)
Compass:      2564 ms (43.2 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/master/prefixers.js
