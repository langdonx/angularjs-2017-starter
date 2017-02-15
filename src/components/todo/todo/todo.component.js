import controller from './todo.controller';
import template from './todo.html';

export default {
    bindings: {
        item: '<',
        onDelete: '&',
        onDone: '&',
    },
    controller,
    name: 'todo',
    template,
};
