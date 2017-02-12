const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const esLint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');
const historyApiFallback = require('connect-history-api-fallback');
const merge = require('gulp-merge');
const path = require('path');
const pump = require('pump');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const styleLint = require('gulp-stylelint');
const through2 = require('through2');
const uglify = require('gulp-uglify');
const webpack = require('gulp-webpack');

const webpackBaseConfig = {
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /src.*\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015'],
                plugins: [
                    ['angularjs-annotate', {
                        explicitOnly: true,
                    }],
                    'transform-html-import-to-string',
                ],
            },
        }],
    },
};

gulp.task('build-development', ['clean'], () => {
    gulp.start(['components', 'html', 'js-app', 'js-vendor']);
});

gulp.task('build-release', ['clean', 'disable-source-maps'], () => {
    gulp.start(['components', 'html', 'js-app', 'js-vendor']);
});

gulp.task('clean', (cb) => {
    pump([
        gulp.src('dist', {
            read: false,
        }),
        clean(),
    ], cb);
});

gulp.task('components', () => {
    const baseComponentsPath = 'src/components';

    // iterate through sub-directories in src/components
    fs.readdirSync(baseComponentsPath)
        .filter(file => fs.statSync(path.join(baseComponentsPath, file)).isDirectory())
        .forEach((folder) => {
            // merge the result of webpack and our own sass compilation
            merge(
                // compile component/index.js with webpack + babel
                gulp.src(path.join(baseComponentsPath, folder, '/index.js'))
                    .pipe(webpack(Object.assign({
                        output: {
                            filename: `${folder}.js`,
                        },
                    }, webpackBaseConfig))),
                // compile all component scss files into javascript
                gulp.src(path.join(baseComponentsPath, folder, '/**/*.scss'))
                    .pipe(sass())
                    .pipe(concat('component.css'))
                    .pipe(through2.obj((chunk, enc, cb) => {
                        const cssJs = `(function() {
  var s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = '${chunk.contents.toString().replace(/\r/g, '').replace(/\n/g, '\\n')}';
  document.getElementsByTagName('head')[0].appendChild(s);
}());`;
                        // avoid eslint complaining no-param-reassign (this can't be in the spirit of that)
                        Object.assign(chunk, {
                            contents: new Buffer(cssJs, 'binary'),
                        });
                        cb(null, chunk);
                    })))
                .pipe(concat(`${folder}.js`))
                .pipe(gulp.dest('dist/components'));
        });
});

gulp.task('develop', ['build-development'], () => {
    gulp.start(['watch', 'serve']);
});

gulp.task('disable-source-maps', () => {
    delete webpackBaseConfig.devtool;
});

gulp.task('html', (cb) => {
    pump([
        gulp.src(['src/index.html']),
        gulp.dest('dist/'),
    ], cb);
});

gulp.task('js-app', (cb) => {
    pump([
        gulp.src('src/app.js'),
        webpack(Object.assign({
            output: {
                filename: 'app.js',
            },
        }, webpackBaseConfig)),
        gulp.dest('dist'),
    ], cb);
});

gulp.task('js-vendor', (cb) => {
    pump([
        gulp.src([
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/oclazyload/dist/ocLazyLoad.js',
        ]),
        concat('vendor.min.js'),
        sourceMaps.init(),
        uglify({
            preserveComments: 'license',
        }),
        sourceMaps.write(),
        gulp.dest('dist/'),
    ], cb);
});

gulp.task('lint', ['lint-js', 'lint-scss']);

gulp.task('lint-js', (cb) => {
    pump([
        gulp.src(['gulpfile.js', 'src/**/*.js']),
        esLint(),
        esLint.format(),
        esLint.failAfterError(),
    ], cb);
});

gulp.task('lint-scss', (cb) => {
    pump([
        gulp.src(['src/**/*.scss']),
        styleLint({
            failAfterError: true,
            debug: true,
            reporters: [{
                formatter: 'string',
                console: true,
            }],
        }),
    ], cb);
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: [historyApiFallback()],
        },
        files: ['./dist/**/*.*'],
        notify: false,
    });
});

gulp.task('watch', () => {
    gulp.watch('src/app.js', ['js-app']);
    gulp.watch('src/routeConfig.js', ['js-app']);
    gulp.watch('src/components/**/*', ['components']);
    gulp.watch('src/index.html', ['html']);
});
