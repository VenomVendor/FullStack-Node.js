import console from 'better-console';
import del from 'del';
import git from 'git-rev-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const srcServerFiles = ['src/**/*.js', '!src/public/**/*.js', '!src/public/**/vendor/*.js'];
const srcClientFiles = ['src/public/**/*.js', '!src/public/**/vendor/*.js'];
const srcClientVendorFiles = ['src/public/**/vendor/*.js'];
const srcHtml = ['src/public/**/*.html'];
const srcSass = ['src/public/**/*.scss'];
const srcImg = ['src/public/images/**/*'];

const DEST = 'build/public/';
const DEST_IMG = [`${DEST}images/**/*`, `!${DEST}images/**/*.ico`];

const DEBUG = !true;
const SHOULD_RENAME = true;
const $ = gulpLoadPlugins({ DEBUG });

const deleteFilesDirs = (destFdr) => {
    del.sync(destFdr);
};

/* eslint arrow-body-style: 0 */
const linter = (files) => {
    return gulp.src(files)
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
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

/**
 * es-lint gulpfile.js
 */
gulp.task('js-self-lint', () => {
    return linter(['*.js']);
});

gulp.task('nodemon', () => {
    $.nodemon({
        script: 'server.js'
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
        .pipe(SHOULD_RENAME ? $.rename({ suffix: `-${git.short()}.min` }) : $.util.noop())
        .pipe(gulp.dest(DEST))
        .pipe(DEBUG ? $.util.noop() : $.uglify())
        .pipe(gulp.dest(DEST));
});

gulp.task('styles', () => {
    gulp.src(srcSass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'expanded',
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
        .pipe(SHOULD_RENAME ? $.rename({ suffix: `-${git.short()}.min` }) : $.util.noop())
        .pipe(gulp.dest(DEST));
});

gulp.task('clearConsole', () => {
    console.clear();
});

gulp.task('images', () => {
    copier(srcImg);
});

gulp.task('vendor-js', () => {
    copier(srcClientVendorFiles);
});

gulp.task('strip-metadata', () => {
    gulp.src(DEST_IMG, { read: false })
        .pipe($.shell(['exiftool -overwrite_original -all= <%= f(file.path) %>'], {
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
    gulp.watch(srcClientVendorFiles, ['vendor-js']);
    gulp.watch(srcHtml, ['minify-html']);
    gulp.watch(srcSass, ['styles']);
    gulp.watch(srcImg, ['images']);
    gulp.watch(DEST_IMG, ['strip-metadata']);
});

gulp.task(
    'default',
    ['js-self-lint', 'clean', 'minify-html', 'images', 'vendor-js', 'strip-metadata', 'eslint', 'minify-js',
        'styles', 'watch', 'nodemon']
);
export default gulp;
