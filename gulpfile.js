'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
//var concat = require('gulp-concat');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
//var notify = require("gulp-notify");
var nodemon = require('gulp-nodemon');
var console = require('better-console');
var htmlmin = require('gulp-htmlmin');
var gutil = require('gulp-util');

var srcFiles = ['./src/**/*.js', '!./src/public/**/*.js'];

var srcClientFiles = ['./src/public/**/*.js'];
var srcHtml = ['./src/public/**/*.html'];
var srcEjs = ['./src/views/**/*.ejs'];
var srcSass = ['./src/public/**/*.scss'];
var srcImg = ['./src/public/images/*'];

var DEST = './build/public/';
var DEST_IMG = [DEST + 'images/**/*', '!' + DEST + 'images/**/*.ico'];

var DEBUG = true;

gulp.task('nodemon', function () {
    nodemon({
        script: 'src/app.js'
    }).on('start', function () {
        console.log('Starting...');
    }).on('restart', function () {
        console.log('Restarting...');
    });
});

gulp.task('jslint', function () {
    return linter(srcFiles.concat(srcClientFiles));
});

gulp.task('jslintSrc', function () {
    return linter(srcFiles);
});

gulp.task('jslintClient', function () {
    return linter(srcClientFiles);
});

gulp.task('minify-html', function () {
    return gulp.src(srcHtml)
        .pipe(DEBUG ? gutil.noop() : htmlmin({
            removeComments               : true,
            removeCDATASectionsFromCDATA : true,
            collapseWhitespace           : true,
            conservativeCollapse         : false,
            preserveLineBreaks           : false,
            collapseBooleanAttributes    : true,
            useShortDoctype              : false,
            removeAttributeQuotes        : true,
            removeRedundantAttributes    : true,
            removeEmptyAttributes        : true,
            removeScriptTypeAttributes   : true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags           : true,
            removeIgnored                : true,
            minifyJS                     : true,
            minifyCSS                    : true,
            minifyURLs                   : true
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('minify-js', function () {
    return gulp.src(srcClientFiles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEST))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST))
        .pipe(DEBUG ? gutil.noop() : uglify())
        .pipe(gulp.dest(DEST));
});

gulp.task('styles', function () {
    gulp.src(srcSass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle      : DEBUG ? 'expanded' : 'compressed',
            sourceComments   : DEBUG,
            sourceMap        : DEBUG,
            sourceMapContents: DEBUG,
            sourceMapEmbed   : DEBUG,
            indentWidth      : 4
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        //.pipe(autoprefixer('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(DEST))
        .pipe(DEBUG ? gutil.noop() : cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST));
});

gulp.task('clearConsole', function () {
    console.clear();
});

gulp.task('ejs', function () {
    copier(srcEjs);
});

gulp.task('images', function () {
    copier(srcImg);
});

gulp.task('strip-metadata', function () {
    gulp.src(DEST_IMG, {read: false})
        .pipe(shell(['exiftoolx -overwrite_original -all= <%= f(file.path) %>'], {
            templateData: {
                f: function (s) {
                    return s;
                }
            },
            ignoreErrors: true,
            quiet       : true
        }));
});

var linter = function (files) {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
//        .pipe(jshint.reporter('fail'));
};

var copier = function (files) {
    gulp.src(files, {base: './src'})
        .pipe(plumber())
        .pipe(gulp.dest('./build'));
};

gulp.task('watch', function () {
    gulp.watch(srcFiles, ['clearConsole', 'jslintSrc']);
    gulp.watch(srcClientFiles, ['clearConsole', 'jslintClient', 'minify-js']);
    gulp.watch(srcHtml, ['minify-html']);
    gulp.watch(srcEjs, ['ejs']);
    gulp.watch(srcSass, ['styles']);
    gulp.watch(srcImg, ['images']);
    gulp.watch(DEST_IMG, ['strip-metadata'])
});

gulp.task('default', ['minify-html', 'images', 'ejs', 'strip-metadata', 'jslint', 'minify-js', 'styles', 'watch', 'nodemon']);
module.exports = gulp;
