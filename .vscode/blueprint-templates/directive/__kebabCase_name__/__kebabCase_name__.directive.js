export default {
    name: '{{camelCase name}}',
    directive: ($log) => {
        'ngInject';

        return {
            restrict: 'A',
            link: (scope, element, attributes) => {
                $log.info(scope, element, attributes);
            },
        };
    },
};
