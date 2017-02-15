import LocalStorageService from './LocalStorageService';
import TodoDataService from './TodoDataService';

export default angular.module('app.services', [])
    .service('LocalStorageService', LocalStorageService)
    .service('TodoDataService', TodoDataService);
