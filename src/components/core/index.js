import app from './app';
import footer from './footer';
import header from './header';
import pathNotFound from './path-not-found';

angular.module('app.core', [])
    .component(app.name, app)
    .component(footer.name, footer)
    .component(header.name, header)
    .component(pathNotFound.name, pathNotFound);
