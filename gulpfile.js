const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');

//  Task for finding errors and problems in Knuff
gulp.task('eslint', () => {
  return gulp.src('src/knuff.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//  Task for running Knuff through Babel
//  after successfully linting the source file
gulp.task('babel', ['eslint'], () => {
  return gulp.src('src/knuff.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(rename('knuff.babel.js'))
    .pipe(gulp.dest('dist'));
});
