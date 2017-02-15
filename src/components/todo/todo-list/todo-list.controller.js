export default class controller {
    constructor($timeout, TodoDataService) {
        'ngInject';

        // dependencies
        Object.assign(this, {
            $timeout,
            TodoDataService,
        });

        this.items = [];
        this.newItemTitle = '';
        this.refreshTimer = undefined;

        // the idea with this controller is that since it will constantly refresh it's data source so you could work
        // on 2 browser windows at once... of course it's limited to a single machine and browser session because it's
        // currently backed by localStorage.
        // there are also better ways with less overhead to accomplish this (web sockets).
    }

    $onInit() {
        this.refreshItems();
    }

    addNewItem() {
        this.TodoDataService.add(this.newItemTitle);
        this.newItemTitle = '';

        this.refreshItems();
    }

    onAddClick() {
        this.addNewItem();
    }

    onClearClick() {
        this.TodoDataService.clear();
        this.items = [];
    }

    onItemDelete(item) {
        this.TodoDataService.delete(item);

        this.refreshItems();
    }

    onItemDone(item) {
        item.done = !item.done;
        this.TodoDataService.update(item);

        this.refreshItems();
    }

    onNewItemKeyDown($event) {
        if ($event.keyCode === 13) {
            this.addNewItem();
        }
    }

    refreshItems() {
        // cancel any previous timer
        this.$timeout.cancel(this.refreshTimer);

        // refresh items from our data source
        this.items = this.TodoDataService.getAll();

        // refresh again later
        this.restartRefreshTimer();
    }

    restartRefreshTimer() {
        this.refreshTimer = this.$timeout(this.refreshItems.bind(this), 2500);
    }
}
