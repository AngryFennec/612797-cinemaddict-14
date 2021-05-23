import Observer from '../utils/observer.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._activeFilter = 'all';
  }

  setActiveFilter(filter) {
    this._activeFilter = filter;
    this._notify(null, filter);
  }

  getActiveFilter() {
    return this._activeFilter;
  }
}
