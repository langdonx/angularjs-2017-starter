Features
- ES2015 with modules
- Angular 1.6
- UI Router 1.0 with html5Mode
- ocLazyLoad for lazy loading logical components
- ngInject (aka ngAnnotate)
- Browser Sync configured to support html5Mode
- ESLint
- Logical component compilation

TODO
- watch gulpfile.js for changes, reload, rebuild: https://www.npmjs.com/package/gulper
- generally improve src/* (code cleanliness, ui, ux)
- generally improve README.md with notes about each feature, reasoning behind approaches
- look into html formatting/linting whether it produces something commitable or not (like .esformatter, .stylelintrc)
- services, create a localStorage service and use it with todo components
- images
- fonts
- tests
- versioned cache busting
- figure out how to get the watcher not to just die when scss compilation fails
    - http://stackoverflow.com/questions/23971388/prevent-errors-from-breaking-crashing-gulp-watch
- fork a bootstrap alternative (bootstrap, ui-bootstrap)
- fork an angular material alternative
- drop gulp-webpack and pipe/pump in favor of using webpack exclusively to get
    - webpack/babel/uglify works fine, but the gulp-webpack workflow mangles it
    - we also want to minimize the differences between dev/release code (we want to test uglified js in dev)

CONSIDER
- when we compile the scss->js the way we are, we lose the ability to use sourcemaps
    - what is more important here? http efficiency or development efficiency? are there any other benefits/detriments i'm missing?
- using gulp-ng-templates... although requiring the template is pretty amazing, i don't think it will ever be supported natively
- using webpack for vendor.js... might let us drop a dependency or two... not sure it's worth much else (try at least for speed, it takes 4 seconds currently)
- the benefits of bootstrapping angular (are there any?)
