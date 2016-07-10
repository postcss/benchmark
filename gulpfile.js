var sequence = require('gulp-sequence');
var gulp     = require('gulp');
var path     = require('path');
var fs       = require('fs-extra');

// Lint

gulp.task('lint', function () {
    var eslint = require('gulp-eslint');
    return gulp.src(['*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Benchmark

gulp.task('clean', function (done) {
    fs.remove(path.join(__dirname, '/cache'), done);
});

gulp.task('bootstrap', function (done) {
    var cache = path.join(__dirname, 'cache', 'bootstrap.css');
    if ( fs.existsSync(cache) ) {
        done();
        return;
    }

    var load = require('load-resources');
    load('github:twbs/bootstrap:dist/css/bootstrap.css', '.css', function (f) {
        fs.outputFile(cache, f, done);
    });
});

['preprocessors', 'parsers', 'prefixers'].forEach(function (name) {
    gulp.task(name, ['bootstrap'], function () {
        var bench   = require('gulp-bench');
        var summary = require('gulp-bench-summary');
        return gulp.src('./' + name + '.js', { read: false })
            .pipe(bench())
            .pipe(summary(name === 'prefixers' ? 'Autoprefixer' : 'PostCSS'));
    });
});

gulp.task('default', sequence('lint', 'preprocessors', 'parsers', 'prefixers'));
