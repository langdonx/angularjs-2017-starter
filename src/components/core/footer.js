import template from './footer.html';

class controller {
    constructor() {
        this.year = new Date().getFullYear();
    }
}

export default {
    name: 'footer',
    controller,
    template,
};
