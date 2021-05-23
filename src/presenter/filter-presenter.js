import {render, RenderPosition} from '../utils/render';
import Navigation from '../view/navigation';

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
    const newFilterInstance = new Navigation(this._filmsModel.getFilms(), this._filterModel.getActiveFilter());
    if (!this._filterComponent) {
      this._filterComponent = newFilterInstance;
      this._renderFilter();
      return;
    }
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
