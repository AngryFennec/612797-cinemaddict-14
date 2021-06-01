import Observer from '../utils/observer.js';
import {EventType, SortType} from '../const.js';

export default class SortModel extends Observer {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  setSortType(type) {
    this._currentSortType = type;
    this._notify(EventType.SET_SORT, type);
  }

  getSortType() {
    return this._currentSortType;
  }
}
