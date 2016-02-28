import gulp from 'gulp';
import del from 'del';
import console from 'better-console';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

const srcServerFiles = ['src/**/*.js', '!src/public/**/*.js'];
const srcClientFiles = ['src/public/**/*.js'];
const srcHtml = ['src/public/**/*.html'];
const srcEjs = ['src/views/**/*.ejs'];
const srcSass = ['src/public/**/*.scss'];
const srcImg = ['src/public/images/*'];

const DEST = 'build/public/';
const DEST_IMG = [`${DEST}images/**/*`, `!${DEST}images/**/*.ico`];

const DEBUG = true;
const SHOULD_RENAME = true;

const deleteFilesDirs = (destFdr) => {
    del.sync(destFdr);
};

const linter = (files) => {
    return gulp.src(files)
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError())
};

/**
 * Files to be copied.
 * Reference is from root directory of gulpfile.js
 * @param files
 */
const copier = (files) => {
    gulp.src(files, { base: 'src' })
        .pipe($.plumber())
        .pipe(gulp.dest('build'));
};

gulp.task('nodemon', () => {
    $.nodemon({
        script: 'src/app.js'
    }).on('start', () => {
        console.log('Starting...');
    }).on('restart', () => {
        console.log('Restarting...');
    });
});

gulp.task('clean', () => {
    deleteFilesDirs('build');
});

gulp.task('eslint', ['eslintSrc', 'eslintClient']);

gulp.task('eslintSrc', () => {
    return linter(srcServerFiles);
});

gulp.task('eslintClient', () => {
    return linter(srcClientFiles);
});

gulp.task('minify-html', () => {
    return gulp.src(srcHtml)
        .pipe(DEBUG ? $.util.noop() : $.htmlmin({
            removeComments: true,
            removeCDATASectionsFromCDATA: true,
            collapseWhitespace: true,
            conservativeCollapse: false,
            preserveLineBreaks: false,
            collapseBooleanAttributes: true,
            useShortDoctype: false,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true,
            removeIgnored: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('minify-js', () => {
    return gulp.src(srcClientFiles)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(DEST))
        .pipe(SHOULD_RENAME ? $.rename({ suffix: '.min' }) : $.util.noop())
        .pipe(gulp.dest(DEST))
        .pipe(DEBUG ? $.util.noop() : $.uglify())
        .pipe(gulp.dest(DEST));
});

gulp.task('styles', () => {
    gulp.src(srcSass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: DEBUG ? 'expanded' : 'compressed',
            sourceComments: DEBUG,
            sourceMap: DEBUG,
            sourceMapContents: DEBUG,
            sourceMapEmbed: DEBUG,
            indentWidth: 4
        }).on('error', $.sass.logError))
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer([
            'last 3 version',
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 5']))
        .pipe($.csscomb())
        .pipe(gulp.dest(DEST))
        .pipe(DEBUG ? $.util.noop() : $.cssnano())
        .pipe(SHOULD_RENAME ? $.rename({ suffix: '.min' }) : $.util.noop())
        .pipe(gulp.dest(DEST));
});

gulp.task('clearConsole', () => {
    console.clear();
});

gulp.task('ejs', () => {
    copier(srcEjs);
});

gulp.task('images', () => {
    copier(srcImg);
});

gulp.task('strip-metadata', () => {
    gulp.src(DEST_IMG, { read: false })
        .pipe($.shell(['exiftoolx -overwrite_original -all= <%= f(file.path) %>'], {
            templateData: {
                f: (s) => {
                    return s;
                }
            },
            ignoreErrors: true,
            quiet: true
        }));
});

gulp.task('watch', () => {
    gulp.watch(srcServerFiles, ['clearConsole', 'eslintSrc']);
    gulp.watch(srcClientFiles, ['clearConsole', 'eslintClient', 'minify-js']);
    gulp.watch(srcHtml, ['minify-html']);
    gulp.watch(srcEjs, ['ejs']);
    gulp.watch(srcSass, ['styles']);
    gulp.watch(srcImg, ['images']);
    gulp.watch(DEST_IMG, ['strip-metadata'])
});

gulp.task(
    'default',
    ['clean', 'minify-html', 'images', 'ejs', 'strip-metadata', 'eslint', 'minify-js', 'styles', 'watch', 'nodemon']
);
export default gulp;
