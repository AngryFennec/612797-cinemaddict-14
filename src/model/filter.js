import Observer from '../utils/observer.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._activeFilter = 'all';
  }

  setActiveFilter(filter) {
    const switchStats = this._activeFilter === 'stats' && filter !== 'stats' || filter === 'stats';
    this._activeFilter = filter;
    if (switchStats) {
      this._notify('switchStats', filter);
    } else {
      this._notify('setFilter', filter);
    }
  }

  getActiveFilter() {
    return this._activeFilter;
  }
}
