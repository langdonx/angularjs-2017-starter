export default class controller {
    constructor($log) {
        'ngInject';

        Object.assign(this, { $log });

        this.year = new Date().getFullYear();
    }

    $onInit() {
        this.$log.info('footer $onInit');
    }
}
