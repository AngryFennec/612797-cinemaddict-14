import Observer from '../utils/observer.js';

export default class SortModel extends Observer {
  constructor() {
    super();
    this._currentSortType = 'default';
  }

  setSortType(type) {
    this._currentSortType = type;
    this._notify(null, type);
  }

  getSortType() {
    return this._currentSortType;
  }
}
