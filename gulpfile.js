const gulp     = require('gulp');
const babel    = require('gulp-babel');
const composer = require('gulp-uglify/composer');
const eslint   = require('gulp-eslint');
const rename   = require('gulp-rename');
const pump     = require('pump');
const uglify   = require('uglify-es');

//  Uglify + ES6+
const minify   = composer(uglify, console);

//  Task for finding errors and problems in Skrolla
gulp.task('eslint', () => {
  pump([
    gulp.src('src/knuff.js'),
    eslint(),
    eslint.format(),
    eslint.failAfterError()
  ]);
});

//  Task for minifying the
//  ES6+ friendly version of Skrolla
gulp.task('minify', ['eslint'], () => {
  pump([
    gulp.src('src/knuff.js'),
    minify(),
    rename('knuff.js'),
    gulp.dest('dist')
  ]);
});

//  Task for running Skrolla through Babel,
//  and then minifying it for older browsers
gulp.task('babel', ['eslint'], () => {
  pump([
    gulp.src('src/knuff.js'),
    babel(),
    minify(),
    rename('knuff.babel.js'),
    gulp.dest('dist')
  ]);
});