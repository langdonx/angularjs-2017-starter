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
- look into configuring html formatting whether it produces something commitable or not (e.g. .esformatter)
- services, create a localStorage service and use it with todo components
- images
- fonts
- tests
- versioned cache busting
- figure out how to get the watcher not to just die when scss compilation fails
- fork a bootstrap alternative (bootstrap, ui-bootstrap)
- fork an angular material alternative
- drop gulp-webpack and pipe/pump in favor of using webpack exclusively to get
    - webpack/babel/uglify works fine, but the gulp-webpack workflow mangles it
    - we also want to minimize the differences between dev/release code (we want to test uglified js in dev)

CONSIDER
- separating the controller class from the component (e.g. todo-list.controller.js)
- each module getting its own sub-directory in its logical grouping directory (e.g. todo/todo-list/\*.js, todo/todo/\*.js, etc)
- when we compile the scss->js the way we are, we lose the ability to use sourcemaps
    - what is more important here? http efficiency or development efficiency? are there any other benefits/detriments i'm missing?
- using gulp-ng-templates... although requiring the template is pretty amazing, i don't think it will ever be supported natively
- using webpack for vendor.js... might let us drop a dependency or two... not sure it's worth much else
- writing code to auto-generates each components/**/index.js file... would speed development up and errors
    - this will likely slow down the build process (copying src => dist-temp, generating index.js files, then compiling)
- the benefits of bootstrapping angular (are there any?)
