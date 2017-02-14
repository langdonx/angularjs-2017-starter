import controller from './todo.controller';
import template from './todo.html';

export default {
    bindings: {
        item: '<',
        onDelete: '&',
    },
    controller,
    name: 'todo',
    template,
};
