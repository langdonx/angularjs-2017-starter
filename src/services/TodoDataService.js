export default class {
    constructor(LocalStorageService) {
        'ngInject';

        // dependencies
        Object.assign(this, {
            LocalStorageService,
        });

        // initialize localStorage
        if (angular.isUndefined(this.LocalStorageService.localStorage.todoItems) === true) {
            this.LocalStorageService.localStorage.todoSeed = 6;
            this.LocalStorageService.localStorage.todoItems = [{
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
        return this.LocalStorageService.localStorage.todoItems;
    }

    add(title) {
        const newTodo = {
            id: this.LocalStorageService.localStorage.todoSeed += 1,
            title,
            done: false,
        };

        // we can't push directly onto the the array since it's a localStorage facade
        const todoItems = this.LocalStorageService.localStorage.todoItems;
        this.LocalStorageService.localStorage.todoItems = todoItems.concat([newTodo]);

        return newTodo;
    }

    clear() {
        this.LocalStorageService.localStorage.todoItems = [];
    }

    delete(todoToDelete) {
        const todoItems = this.LocalStorageService.localStorage.todoItems;

        if (todoItems) {
            todoItems.some((todo, index) => {
                if (todo.id === todoToDelete.id) {
                    todoItems.splice(index, 1);
                    return true;
                }

                return false;
            });

            this.LocalStorageService.localStorage.todoItems = todoItems;
        }
    }

    update(updatedTodo) {
        const todoItems = this.LocalStorageService.localStorage.todoItems;

        if (todoItems) {
            todoItems.some((todo) => {
                if (todo.id === updatedTodo.id) {
                    Object.assign(todo, updatedTodo);
                    return true;
                }

                return false;
            });

            this.LocalStorageService.localStorage.todoItems = todoItems;
        }
    }
}
