const path = require('path');
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const csso = require('gulp-csso');
const gulpif = require('gulp-if');
const gulpMultiProcess = require('gulp-multi-process')
const autoprefixer = require('gulp-autoprefixer');
const base64 = require('gulp-base64-inline');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const del = require('del');

const debug = process.env.NODE_ENV !== 'production';

const SRC = './src';
const DIST = './lib';

const projectName = require('./package.json').name;

const babelOption = {
  presets: [['env', {
    option: {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }
  }], ['stage-2']]
}

const packer =  browserify(`${SRC}/index.js`, {
  debug: true,
  standalone: 'mc'
}).transform(babelify, babelOption);

gulp.task('js', () => {
  return packer
    .bundle()
    .pipe(source(`${projectName}.js`))
    .pipe(buffer())
    .pipe(gulp.dest(DIST))
    .pipe(browserSync.stream())
    .pipe(gulpif(!debug, rename(`${projectName}.min.js`)))
    .pipe(gulpif(!debug, uglify()))
    .pipe(gulpif(!debug, gulp.dest(DIST)));
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
        .pipe(browserSync.stream())
        .pipe(gulpif(!debug, rename(`${projectName}.min.css`)))
        .pipe(gulpif(!debug, csso()))
        .pipe(gulpif(!debug, gulp.dest(DIST)));
})

gulp.task('image', () => {
  gulp.src(['./src/images/**'])
    .pipe(gulp.dest(`${DIST}/images`));
})

gulp.task('watch', ['image', 'js', 'css'], () => {

  browserSync.init({
    server: ['public', 'lib', 'node_modules']
  });

  gulp.watch(['./src/**/*.js'], ['js']);

  gulp.watch(['./src/**/*.less'], () => {
    gulpMultiProcess(['css'], function () {})
  });

  gulp.watch("./public/*.{html,css}").on('change', browserSync.reload);
})

gulp.task('build', ['image', 'css', 'js'])



