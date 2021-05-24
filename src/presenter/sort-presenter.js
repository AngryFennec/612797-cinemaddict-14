import {render, RenderPosition} from '../utils/render';
import Sort from '../view/sort';

export default class SortPresenter {
  constructor(container, sortModel, filmsModel) {
    this._container = container;
    this._sortClick = this._sortClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._sortModel = sortModel;
    this._filmsModel = filmsModel;
    this._sortModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._currentSortType = 'default';
  }

  init() {
    const newSortInstance = new Sort();
    if (!this._sortComponent) {
      this._sortComponent = newSortInstance;
      this._renderSort();
      return;
    }
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

  _handleModelEvent() {
    this.init();
  }
}
