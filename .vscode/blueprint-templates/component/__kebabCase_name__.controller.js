export default class {
    constructor($log) {
        'ngInject';

        Object.assign(this, { $log });
    }

    $onInit() {
        this.$log.debug('{{kebabCase name}} $onInit');
    }
}
