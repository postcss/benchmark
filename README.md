# PostCSS Benchmarks

Various benchmarks to have feedback about [PostCSS] perfomance.

All results below was runned on Fedora 21, Intel 5Y70, 8 GB RAM and SSD.

[PostCSS]: https://github.com/postcss/postcss

## Preprocessors

Compare CSS processors for parsings, nested rules, mixins, variables and math:

```
PostCSS:   36 ms
Rework:    77 ms   (2.1 times slower)
libsass:   136 ms  (3.8 times slower)
Less:      160 ms  (4.4 times slower)
Stylus:    167 ms  (4.6 times slower)
Stylecow:  208 ms  (5.7 times slower)
Ruby Sass: 1084 ms (30.1 times slower)
```

To get results on your environment:

```sh
npm install
bundle install
npm test preprocessors
```

## Parsers

Compare CSS parsers written on JS:

```
PostCSS:     37 ms
CSSOM:       38 ms  (1.0 times slower)
Mensch:      39 ms  (1.0 times slower)
Rework:      67 ms  (1.8 times slower)
Stylecow:    120 ms (3.2 times slower)
Gonzales:    173 ms (4.6 times slower)
Gonzales PE: 935 ms (25.0 times slower)
```

To get results on your environment:

```sh
npm install
npm test parsers
```
