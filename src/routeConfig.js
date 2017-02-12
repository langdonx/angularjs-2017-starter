export default ($locationProvider, $stateProvider) => {
    'ngInject';

    const loadDependencies = (...components) => ($q, $ocLazyLoad) => {
        'ngInject';

        return $q.all(components.map(component => $ocLazyLoad.load(`components/${component}.js`)));
    };

    $locationProvider.html5Mode(true);

    $stateProvider
        .state({
            abstract: true,
            component: 'app',
            name: 'app',
            resolve: {
                dependencies: loadDependencies('core'),
            },
        })
        .state({
            component: 'about',
            name: 'app.about',
            resolve: {
                dependencies: loadDependencies('about'),
            },
            url: '/',
        })
        .state({
            component: 'todoList',
            name: 'app.todo',
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
