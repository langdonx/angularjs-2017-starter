import routeConfig from './routeConfig';
import services from './services'; // eslint-disable-line no-unused-vars

angular.module('app', ['app.services', 'ui.router', 'oc.lazyLoad'])
    .value('AppVersion', document.querySelector('base').getAttribute('version'))
    .config(routeConfig);
