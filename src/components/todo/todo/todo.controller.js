export default class {
    constructor($log) {
        'ngInject';

        Object.assign(this, { $log });

        this.item = {}; // binding
        this.onDelete = () => {}; // binding
        this.onDone = () => {}; // binding
    }

    $onInit() {
        this.$log.info('todo $onInit');
    }

    onDeleteClick() {
        this.onDelete();
    }

    onDoneClick() {
        this.onDone();
    }
}
