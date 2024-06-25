# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/?utm_source=postcss&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

All results below was run on Node 20.3.1, Github Actions:

[PostCSS]: https://github.com/postcss/postcss


## Preprocessors

Compare [CSS processors] for parsings, nested rules, mixins, variables and math:

```
PostCSS sync:   70 ms  (1.0 times faster)
PostCSS:        72 ms
LibSass sync:   118 ms (1.6 times slower)
LibSass:        123 ms (1.7 times slower)
Less:           139 ms (1.9 times slower)
Dart Sass sync: 219 ms (3.0 times slower)
Dart Sass:      397 ms (5.5 times slower)
```

To get results on your environment:

```sh
pnpm install
pnpm test preprocessors
```

[CSS processors]: https://github.com/postcss/benchmark/blob/main/preprocessors.js


## Parsers

Compare [CSS parsers] written on JS:

```
Stylis:       15 ms  (1.8 times faster)
CSSOM:        24 ms  (1.2 times faster)
PostCSS:      28 ms
CSSTree:      37 ms  (1.3 times slower)
Mensch:       37 ms  (1.3 times slower)
Rework:       49 ms  (1.8 times slower)
Stylecow:     73 ms  (2.6 times slower)
PostCSS Full: 95 ms  (3.4 times slower)
ParserLib:    153 ms (5.5 times slower)
Gonzales:     177 ms (6.4 times slower)
```

To get results on your environment:

```sh
pnpm install
pnpm test parsers
```

[CSS parsers]: https://github.com/postcss/benchmark/blob/main/parsers.js


## Prefixers

Compare [vendor prefixes tools]:

```
Lightning CSS: 12 ms   (7.7 times faster)
Stylis:        18 ms   (5.3 times faster)
Autoprefixer:  96 ms
Stylecow:      1009 ms (10.5 times slower)
```

To get results on your environment:

```sh
pnpm install
pnpm test prefixers
```

[vendor prefixes tools]: https://github.com/postcss/benchmark/blob/main/prefixers.js
