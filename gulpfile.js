const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const gulpMultiProcess = require('gulp-multi-process')
const autoprefixer = require('gulp-autoprefixer');
const base64 = require('gulp-base64-inline');
const rename = require('gulp-rename');
const del = require('del');

const SRC = './src'
const DIST = './lib';

const projectName = require('./package.json').name;

const babelOption = {
  presets: [['env', {
    option: {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }
  }], ['stage-2']]
}

gulp.task('js', () => {
  return browserify(`${SRC}/index.js`, {
    debug: true,
    standalone: 'mc'
  }).transform(babelify, babelOption)
    .bundle()
    .pipe(source(`${projectName}.js`))
    .pipe(buffer())
    .pipe(gulp.dest(DIST));
})

gulp.task('css', () => {
    gulp.src(`${SRC}/style.less`)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename(`${projectName}.css`))
        .pipe(gulp.dest(DIST))
})


gulp.task('image', () => {
  gulp.src(['./src/images/**'])
    .pipe(gulp.dest(`${DIST}/images`));
})

gulp.task('watch', ['image'], () => {
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch(['./src/**/*.less'], () => {
    gulpMultiProcess(['css'], function () {})
  });
})

gulp.task('build', ['image', 'css', 'js'])



