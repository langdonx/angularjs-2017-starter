export default class {
    constructor(StorageService) {
        'ngInject';

        Object.assign(this, { StorageService });

        // initialize localStorage
        if (angular.isUndefined(this.StorageService.localStorage.todoItems) === true) {
            this.StorageService.localStorage.todoSeed = 6;
            this.StorageService.localStorage.todoItems = [{
                id: 1,
                title: 'kick',
                done: false,
            }, {
                id: 2,
                title: 'punch',
                done: false,
            }, {
                id: 3,
                title: 'chop',
                done: false,
            }, {
                id: 4,
                title: 'duck',
                done: false,
            }, {
                id: 5,
                title: 'turn',
                done: false,
            }, {
                id: 6,
                title: 'pose',
                done: false,
            }];
        }
    }

    getAll() {
        return this.StorageService.localStorage.todoItems;
    }

    add(title) {
        const newTodo = {
            id: this.StorageService.localStorage.todoSeed += 1,
            title,
            done: false,
        };

        // we can't push directly onto the the array since it's a localStorage facade
        const todoItems = this.StorageService.localStorage.todoItems;
        this.StorageService.localStorage.todoItems = todoItems.concat([newTodo]);

        return newTodo;
    }

    clear() {
        this.StorageService.localStorage.todoItems = [];
    }

    delete(todoToDelete) {
        const todoItems = this.StorageService.localStorage.todoItems;

        if (todoItems) {
            todoItems.some((todo, index) => {
                if (todo.id === todoToDelete.id) {
                    todoItems.splice(index, 1);
                    return true;
                }

                return false;
            });

            this.StorageService.localStorage.todoItems = todoItems;
        }
    }

    update(updatedTodo) {
        const todoItems = this.StorageService.localStorage.todoItems;

        if (todoItems) {
            todoItems.some((todo) => {
                if (todo.id === updatedTodo.id) {
                    Object.assign(todo, updatedTodo);
                    return true;
                }

                return false;
            });

            this.StorageService.localStorage.todoItems = todoItems;
        }
    }
}
