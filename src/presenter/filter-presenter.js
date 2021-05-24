import {render, RenderPosition} from '../utils/render';
import Filter from '../view/filter';

export default class FilterPresenter {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filterClick = this._filterClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);

  }

  init() {

    const newFilterInstance = new Filter(this._getFilterCounts(), this._filterModel.getActiveFilter());
    if (!this._filterComponent) {
      this._filterComponent = newFilterInstance;
      this._renderFilter();
      return;
    }
  }

  _getFilterCounts() {
    return {
      watchlistCount: this._filmsModel.getFilms().filter((item) => item.userDetails.watchlist).length,
      historyCount: this._filmsModel.getFilms().filter((item) => item.userDetails.alreadyWatched).length,
      favoritesCount: this._filmsModel.getFilms().filter((item) => item.userDetails.favorite).length,
    };
  }

  _renderFilter() {
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    this._setFilterHandlers();
  }

  _setFilterHandlers() {
    this._filterComponent.setClickHandler(this._filterClick);
  }

  _filterClick(filter) {
    this._filterModel.setActiveFilter(filter);
  }

  _handleModelEvent() {
    this.init();
  }
}
