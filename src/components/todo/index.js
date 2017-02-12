import todoList from './todo-list';
import todo from './todo';

angular.module('app.todo', [])
    .component(todoList.name, todoList)
    .component(todo.name, todo);
