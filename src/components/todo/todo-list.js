import template from './todo-list.html';

class controller {
    constructor() {
        this.idSeed = 7;

        this.items = [
            {
                id: 1,
                title: 'kick',
            }, {
                id: 2,
                title: 'punch',
            }, {
                id: 3,
                title: 'chop',
            }, {
                id: 4,
                title: 'duck',
            }, {
                id: 5,
                title: 'turn',
            }, {
                id: 6,
                title: 'pose',
            },
        ];

        this.newItemTitle = '';
    }

    addItemAndClearText() {
        this.items.push({
            id: this.idSeed += 1,
            title: this.newItemTitle,
        });

        this.newItemTitle = '';
    }

    onAddClick() {
        this.addItemAndClearText();
    }

    onClearClick() {
        this.items.splice(0, this.items.length);
    }

    onItemDelete(item) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    onNewItemKeyDown($event) {
        if ($event.keyCode === 13) {
            this.addItemAndClearText();
        }
    }
}

export default {
    name: 'todoList',
    controller,
    template,
};
