export default ($locationProvider, $stateProvider) => {
    'ngInject';

    const loadDependencies = (...components) => ($q, $ocLazyLoad, AppVersion) => {
        'ngInject';

        return $q.all(components.map(component => $ocLazyLoad.load(`${AppVersion}/components/${component}.js`)));
    };

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('app', {
            abstract: true,
            component: 'app',
            resolve: {
                dependencies: loadDependencies('core'),
            },
        })
        .state('app.about', {
            component: 'about',
            resolve: {
                dependencies: loadDependencies('about'),
            },
            url: '/',
        })
        .state('app.language-features', {
            component: 'languageFeatures',
            resolve: {
                dependencies: loadDependencies('language-features'),
            },
            url: '/language-features',
        })
        .state('app.todo', {
            component: 'todoList',
            resolve: {
                dependencies: loadDependencies('todo'),
            },
            url: '/todo',
        })
        .state('otherwise', {
            url: '*path',
            template: '<path-not-found></path-not-found>',
        });
};
