const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const esLint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');
const gulpWebpack = require('gulp-webpack');
const historyApiFallback = require('connect-history-api-fallback');
const merge = require('gulp-merge');
const minifyCss = require('gulp-minify-css');
const path = require('path');
const pump = require('pump');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const styleLint = require('gulp-stylelint');
const through2 = require('through2');
const uglify = require('gulp-uglify');
const webpack = require('webpack');

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
                    'transform-html-import-to-string',
                    'babel-plugin-ng-component-module',
                ],
            },
        }],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        })
    ],
};

gulp.task('build-development', ['clean'], () => {
    gulp.start(['components', 'copy-assets', 'html', 'js-app', 'js-vendor']);
});

gulp.task('build-release', ['clean', 'configure-webpack-for-release'], () => {
    gulp.start(['components', 'copy-assets', 'html', 'js-app', 'js-vendor']);
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
            const indexPath = path.join(baseComponentsPath, folder, '/index.js');

            if (fs.existsSync(indexPath) === true) {
                // merge the result of webpack and our own sass compilation
                merge(
                    // compile component/index.js with webpack + babel
                    gulp.src(indexPath)
                        .pipe(gulpWebpack(Object.assign({
                            output: {
                                filename: `${folder}.js`,
                            },
                        }, webpackBaseConfig))),
                    // compile all component scss files into javascript
                    gulp.src(path.join(baseComponentsPath, folder, '/**/*.scss'))
                        .pipe(sass())
                        .on('error', (...args) => {
                            // this prevents gulp from crashing during sass errors
                            console.error('swallowed sass Error', args);
                        })
                        .pipe(concat('component.css'))
                        .pipe(replace('/assets/', `/${appVersion}/assets/`))
                        .pipe(minifyCss())
                        .pipe(through2.obj((chunk, enc, cb) => {
                            // avoid eslint complaining about max-len
                            let cssJs = '!function(){var e=document.createElement("style");e.type="text/css"';
                            cssJs += `,e.innerHTML="${chunk.contents.toString().replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, '\\n')}"`;
                            cssJs += ',document.getElementsByTagName("head")[0].appendChild(e)}();';

                            chunk.contents = new Buffer(cssJs, 'binary');

                            cb(null, chunk);
                        })))
                    .pipe(concat(`${folder}.js`))
                    .pipe(gulp.dest(`dist/${appVersion}/components`));
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
        replace(/\{version\}/g, appVersion),
        gulp.dest('dist/'),
    ], cb);
});

gulp.task('js-app', (cb) => {
    const config = Object.assign({
        entry: './src/app.js',
        output: {
            filename: `./dist/${appVersion}/app.js`,
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
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/oclazyload/dist/ocLazyLoad.js',
        ]),
        concat('vendor.min.js'),
        sourceMaps.init(),
        uglify({
            preserveComments: 'license',
        }),
        sourceMaps.write(),
        gulp.dest(`dist/${appVersion}`),
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
        files: ['./dist/**/*.*'],
        ghostMode: false,
        notify: false,
        server: {
            baseDir: './dist',
            middleware: [historyApiFallback()],
        },
    });
});

gulp.task('watch', () => {
    gulp.watch(['src/app.js', 'src/routeConfig.js', 'src/services/**/*.js'], ['js-app']);
    gulp.watch(['src/components/**/*', 'src/styleConfig.scss'], ['components']);
    gulp.watch('src/assets/**/*', ['copy-assets']);
    gulp.watch('src/index.html', ['html']);
});
