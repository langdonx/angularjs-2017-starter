const browserSync = require('browser-sync').create();
const connecthistoryApiFallback = require('connect-history-api-fallback');
const fs = require('fs');
const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const gulpCleanCss = require('gulp-clean-css');
const gulpConcat = require('gulp-concat');
const gulpEsLint = require('gulp-eslint');
const gulpMerge = require('gulp-merge');
const gulpReplace = require('gulp-replace');
const gulpSass = require('gulp-sass');
const gulpSassUnicode = require('gulp-sass-unicode');
const gulpSourceMaps = require('gulp-sourcemaps');
const gulpStyleLint = require('gulp-stylelint');
const gulpUglify = require('gulp-uglify');
const gulpWatch = require('gulp-watch');
const path = require('path');
const pump = require('pump');
const through2 = require('through2');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const appVersion = JSON.parse(fs.readFileSync('./package.json')).version;

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
                    'transform-async-to-generator',
                    'transform-exponentiation-operator',
                    'transform-html-import-to-string',
                    'transform-runtime',
                    'babel-plugin-ng-component-module',
                ],
            },
        }],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),
    ],
};

gulp.task('build', () => {
    gulp.start(['components', 'copy-assets', 'html', 'js-app', 'js-vendor']);
});

gulp.task('build-development', ['clean'], () => {
    gulp.start('build');
});

gulp.task('build-release', ['clean', 'configure-webpack-for-release'], () => {
    gulp.start('build');
});

gulp.task('clean', () => gulp.src('dist', { read: false }).pipe(gulpClean()));

gulp.task('components', () => {
    const baseComponentsPath = 'src/components';

    // iterate through sub-directories in src/components
    fs.readdirSync(baseComponentsPath)
        .filter(file => fs.statSync(path.join(baseComponentsPath, file)).isDirectory())
        .forEach((folder) => {
            const indexPath = path.join(baseComponentsPath, folder, '/index.js');

            if (fs.existsSync(indexPath) === true) {
                // merge the result of webpack and our own sass compilation
                gulpMerge(
                    // compile component/index.js with webpack + babel
                    gulp.src(indexPath)
                        .pipe(webpackStream(Object.assign({
                            output: {
                                filename: `${folder}.js`,
                            },
                        }, webpackBaseConfig))),
                    // compile all component scss files into javascript
                    gulp.src(path.join(baseComponentsPath, folder, '/**/*.scss'))
                        .pipe(gulpSass())
                        .pipe(gulpSassUnicode())
                        .on('error', (...args) => {
                            // this prevents gulp from crashing during sass errors
                            console.error('swallowed sass Error', args);
                        })
                        .pipe(gulpConcat('component.css'))
                        .pipe(gulpReplace('/assets/', `/${appVersion}/assets/`))
                        .pipe(gulpCleanCss())
                        .pipe(through2.obj((chunk, enc, cb) => {
                            const cssJs = `!function(){var e=document.createElement("style");e.type="text/css",e.innerHTML="${chunk.contents.toString().replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, '\\n')}",document.getElementsByTagName("head")[0].appendChild(e)}();`; // eslint-disable-line max-len

                            chunk.contents = new Buffer(cssJs, 'binary');

                            cb(null, chunk);
                        })))
                    .pipe(gulpConcat(`${folder}.js`))
                    .pipe(gulp.dest(`./dist/${appVersion}/components`));
            }
        });
});

gulp.task('configure-webpack-for-release', () => {
    // disable source maps
    delete webpackBaseConfig.devtool;
});

gulp.task('copy-assets', (cb) => {
    pump([
        gulp.src('src/assets/**/*'),
        gulp.dest(`dist/${appVersion}/assets`),
    ], cb);
});

gulp.task('develop', ['build-development'], () => {
    gulp.start(['watch', 'serve']);
});

gulp.task('html', (cb) => {
    pump([
        gulp.src(['src/index.html']),
        gulpReplace(/\{version\}/g, appVersion),
        gulp.dest('dist/'),
    ], cb);
});

gulp.task('js-app', (cb) => {
    const config = Object.assign({
        entry: './src/app.js',
        output: {
            filename: `./dist/${appVersion}/app.min.js`,
        },
    }, webpackBaseConfig);

    webpack(config, () => {
        // TODO report errors
        cb();
    });
});

gulp.task('js-vendor', (cb) => {
    pump([
        gulp.src([
            'node_modules/angular/angular.js',
            'node_modules/oclazyload/dist/ocLazyLoad.js',
            'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
        ]),
        gulpConcat('vendor.min.js'),
        gulpSourceMaps.init(),
        gulpUglify(),
        gulpSourceMaps.write(),
        gulp.dest(`dist/${appVersion}`),
    ], cb);
});

gulp.task('lint', ['lint-js', 'lint-scss']);

gulp.task('lint-js', () => gulp
    .src(['gulpfile.js', './src/**/*.js'])
    .pipe(gulpEsLint())
    .pipe(gulpEsLint.format())
    .pipe(gulpEsLint.failAfterError()));

gulp.task('lint-scss', (cb) => {
    pump([
        gulp.src(['src/**/*.scss']),
        gulpStyleLint({
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
        files: ['./dist/**/*.*'],
        ghostMode: false,
        notify: false,
        server: {
            baseDir: './dist',
            middleware: [connecthistoryApiFallback()],
        },
        snippetOptions: {
            blacklist: ['**/*?disable-browsersync'],
        },
    });
});

gulp.task('watch', () => {
    gulpWatch(['src/app.js', 'src/stateConfig.js', 'src/services/**/*.js'], () => gulp.start('js-app'))
        .on('error', (...args) => console.log('WATCH ERROR js-app', args)); // eslint-disable-line no-console

    gulpWatch(['src/components/**/*', 'src/styleConfig.scss'], () => gulp.start('components'))
        .on('error', (...args) => console.log('WATCH ERROR components', args)); // eslint-disable-line no-console

    gulpWatch('src/assets/**/*', () => gulp.start('copy-assets'))
        .on('error', (...args) => console.log('WATCH ERROR copy-assets', args)); // eslint-disable-line no-console

    gulpWatch('src/index.html', () => gulp.start('html'))
        .on('error', (...args) => console.log('WATCH ERROR html', args)); // eslint-disable-line no-console
});
