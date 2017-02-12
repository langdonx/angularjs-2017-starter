import template from './todo.html';

const controller = class {
    onDeleteClick() {
        this.onDelete();
    }

    onDoneClick() {
        this.item.done = !this.item.done;
    }
};

export default {
    name: 'todo',
    bindings: {
        item: '<',
        onDelete: '&',
    },
    controller,
    template,
};
