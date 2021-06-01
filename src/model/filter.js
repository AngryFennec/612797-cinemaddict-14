import Observer from '../utils/observer.js';
import {EventType, FilterType} from '../const.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setActiveFilter(filter) {
    const switchStats = this._activeFilter === FilterType.STATS && filter !== FilterType.STATS || filter === FilterType.STATS;
    this._activeFilter = filter;
    if (switchStats) {
      this._notify(EventType.SWITCH_STATS, filter);
    } else {
      this._notify(EventType.SET_FILTER, filter);
    }
  }

  getActiveFilter() {
    return this._activeFilter;
  }
}
