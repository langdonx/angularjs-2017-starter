export default class {
    constructor($window) {
        'ngInject';

        this.localStorage = new Proxy({}, {
            get: (target, prop) => {
                const value = $window.localStorage[prop];

                return (angular.isDefined(value) === true) ? JSON.parse(value) : value;
            },
            set: (target, prop, value) => {
                $window.localStorage[prop] = JSON.stringify(value);
                return true;
            },
            deleteProperty: (target, prop) => delete $window.localStorage[prop],
        });

        this.sessionStorage = new Proxy({}, {
            get: (target, prop) => {
                const value = $window.sessionStorage[prop];

                return (angular.isDefined(value) === true) ? JSON.parse(value) : value;
            },
            set: (target, prop, value) => {
                $window.sessionStorage[prop] = JSON.stringify(value);
                return true;
            },
            deleteProperty: (target, prop) => delete $window.sessionStorage[prop],
        });
    }
}
