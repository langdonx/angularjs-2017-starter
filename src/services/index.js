import StorageService from './StorageService';
import TodoDataService from './TodoDataService';

export default angular.module('app.services', [])
    .service('StorageService', StorageService)
    .service('TodoDataService', TodoDataService);
