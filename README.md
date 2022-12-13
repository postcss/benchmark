# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was run on Node 19.2.0, GitHub Actions:

[PostCSS]: https://github.com/postcss/postcss


## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS sync:   74 ms  (1.1 times faster)
PostCSS:        78 ms
LibSass sync:   110 ms (1.4 times slower)
LibSass:        112 ms (1.4 times slower)
Less:           140 ms (1.8 times slower)
Dart Sass sync: 197 ms (2.5 times slower)
Dart Sass:      376 ms (4.8 times slower)
```

To get results on your environment:

```sh
npm install
npm test preprocessors
```

[CSS processors]: https://github.com/postcss/benchmark/blob/main/preprocessors.js


## Parsers

Compare [CSS parsers] written on JS:

```
Stylis:       14 ms  (2.3 times faster)
CSSOM:        22 ms  (1.5 times faster)
CSSTree:      31 ms  (1.1 times faster)
PostCSS:      33 ms
Mensch:       33 ms  (1.0 times slower)
Rework:       51 ms  (1.5 times slower)
Stylecow:     66 ms  (2.0 times slower)
PostCSS Full: 93 ms  (2.8 times slower)
ParserLib:    141 ms (4.2 times slower)
Gonzales:     159 ms (4.8 times slower)
```

To get results on your environment:

```sh
npm install
npm test parsers
```

[CSS parsers]: https://github.com/postcss/benchmark/blob/main/parsers.js


## Prefixers

Compare [vendor prefixes tools]:

```
Lightning CSS: 12 ms  (7.9 times faster)
Stylis:        18 ms  (5.2 times faster)
Autoprefixer:  94 ms
Stylecow:      835 ms (8.9 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/main/prefixers.js
