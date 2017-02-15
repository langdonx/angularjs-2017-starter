import routeConfig from './routeConfig';
import services from './services'; // eslint-disable-line no-unused-vars

angular.module('app', ['app.services', 'ui.router', 'oc.lazyLoad'])
    .config(routeConfig);
