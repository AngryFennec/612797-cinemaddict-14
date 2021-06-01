import {render, RenderPosition, replace} from '../utils/render';
import Sort from '../view/sort';
import {EventType, SortType} from '../const.js';

export default class SortPresenter {
  constructor(container, sortModel, filmsModel, filterModel) {
    this._container = container;
    this._sortClick = this._sortClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._sortModel = sortModel;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._sortModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._currentSortType = 'default';
  }

  init(sortType = 'default') {
    const newSortInstance = new Sort(sortType);
    if (!this._sortComponent) {
      this._sortComponent = newSortInstance;
      this._renderSort();
      return;
    }
    replace(newSortInstance, this._sortComponent);
    this._sortComponent = newSortInstance;
    this._setSortHandlers();
  }

  _renderSort() {
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    this._setSortHandlers();
  }

  _setSortHandlers() {
    this._sortComponent.setClickHandler(this._sortClick);
  }

  _sortClick(sortType) {
    this._currentSortType = sortType;
    this._sortModel.setSortType(sortType);
  }

  _handleModelEvent(event) {
    if (event === EventType.SET_FILTER || event === EventType.SWITCH_STATS) {
      this.init(SortType.DEFAULT);
    }
    if (event === EventType.SET_SORT) {
      this.init(this._currentSortType);
    }
  }
}
