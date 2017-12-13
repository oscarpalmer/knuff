const gulp = require('gulp');
const babel = require('gulp-babel');
const composer = require('gulp-uglify/composer');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const uglify = require('uglify-es');

//  Uglify + ES6+
const minify = composer(uglify, console);

//  Task for finding errors and problems in Knuff
gulp.task('eslint', () => {
  return gulp.src('src/knuff.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//  Task for running Knuff through Babel
//  after successfully linting the source file
//  and then minifying it
gulp.task('babel', ['eslint'], () => {
  return gulp.src('src/knuff.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(minify())
    .pipe(rename('knuff.babel.js'))
    .pipe(gulp.dest('dist'));
});

//  Task for minifying Knuff after
//  successfully linting the source file
gulp.task('minify', ['eslint'], () => {
  return gulp.src('src/knuff.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});
