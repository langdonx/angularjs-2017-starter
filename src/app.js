import routeConfig from './routeConfig';

angular.module('app', ['ui.router', 'oc.lazyLoad'])
    .config(routeConfig);
