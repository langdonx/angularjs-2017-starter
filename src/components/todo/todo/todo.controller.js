export default class {
    constructor() {
        // bindings
        this.item = {};
        this.onDelete = () => {};
        this.onDone = () => {};
    }

    onDeleteClick() {
        this.onDelete();
    }

    onDoneClick() {
        this.onDone();
    }
}
