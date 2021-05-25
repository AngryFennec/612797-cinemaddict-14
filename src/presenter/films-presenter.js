import FilmsList from '../view/films-list';
import {render, RenderPosition, replace} from '../utils/render';
import Films from '../view/films';
import FilmsListExtra from '../view/films-list-extra';
import FilmsEmptyList from '../view/films-empty-list';
import ShowMoreBtn from '../view/show-more-btn';
import FilmCardPresenter from './film-card-presenter';
import {
  getMostCommentedFilms,
  getNextRenderCardIterator,
  getTopRatedFilms,
  sortByDate,
  sortById,
  sortByRating
} from '../utils/presenter';
import FilterModel from '../model/filter';
import SortModel from '../model/sort';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;

export default class FilmsPresenter {
  constructor(container, filmsModel, menuClickHandler) {
    this._filmsContainer = container;
    this._filmsModel = filmsModel;
    this._filterModel = new FilterModel();
    this._sortModel = new SortModel();

    this._filmsComponent = new Films();
    this._filmsListComponent = null;
    this._mostCommentedFilmsListComponent = new FilmsListExtra(MOST_COMMENTED_TITLE);
    this._topRatedFilmsListComponent = new FilmsListExtra(TOP_RATED_TITLE);
    this._filmsEmptyListComponent = new FilmsEmptyList();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._filmsPresenters = [];
    this._topRatedPresenters = [];
    this._mostCommentedPresenters = [];
    this._currentFilter = 'all';
    this._currentSortType = 'default';
    this._menuClickHandler = menuClickHandler;
    this._sortPresenter = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._updateData = this._updateData.bind(this);
  }

  init() {
    // меню
    const filterPresenter = new FilterPresenter(this._filmsContainer, this._filterModel, this._filmsModel, this._menuClickHandler);
    filterPresenter.init();
    //сортировка
    this._sortPresenter = new SortPresenter(this._filmsContainer, this._sortModel, this._filmsModel);
    this._sortPresenter.init();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._sortModel.addObserver(this._handleModelEvent);

    this._initFilms();
  }

  _getFilms() {
    let filteredFilms = this._filmsModel.getFilms();
    switch(this._filterModel.getActiveFilter()) {
      case 'watchlist':
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.watchlist);
        break;
      case 'history':
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.alreadyWatched);
        break;
      case 'favorites':
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.favorite);
        break;
    }

    switch (this._sortModel.getSortType()) {
      case 'date':
        return filteredFilms.sort(sortByDate);
      case 'rating':
        return filteredFilms.sort(sortByRating);
      default:
        return filteredFilms.sort(sortById);
    }
  }

  _initFilms() {

    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderFilms();

    // дополнительные секции
    render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._initExtraFilmsSection();
  }

  _renderFilmCards(container, films, array) {
    for (let i = 0; i < films.length; i++) {
      const filmCardPresenter = new FilmCardPresenter(films[i], container, this._updateData);
      filmCardPresenter.init();
      array.push(filmCardPresenter);
    }
  }

  _renderShowMoreButton(iterator) {
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const {value: filmsPart, done} = iterator.next();
      this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart, this._filmsPresenters);

      if (done) {
        this._showMoreButtonComponent.removeElement();
      }
    });
  }

  _renderFilms() {
    const filmsElement = this._filmsComponent.getElement();
    if (!this._getFilms() || this._getFilms().length === 0) {
      render(filmsElement, this._filmsEmptyListComponent, RenderPosition.BEFOREEND);
      return;
    }
    const newFilmsListInstance = new FilmsList();
    if (this._filmsListComponent) {
      replace(newFilmsListInstance, this._filmsListComponent);
    } else {
      render(filmsElement, newFilmsListInstance, RenderPosition.AFTERBEGIN);
    }

    this._filmsListComponent = newFilmsListInstance;
    const iterator = getNextRenderCardIterator(this._getFilms(), FILMS_PER_STEP);
    const {value: filmsPart} = iterator.next();
    this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart, this._filmsPresenters);

    if (this._getFilms().length > FILMS_PER_STEP) {
      this._renderShowMoreButton(iterator);
    }
  }
  // в карточке фильма при изменении данных фильма
  _updateData(updatedFilmData) {
    this._filmsModel.updateFilm(updatedFilmData);
  }

  _handleModelEvent(event, updatedFilmData) {
    if (!updatedFilmData) {
      return this._initFilms();
    }
    this._currentFilter = this._filterModel.getActiveFilter();
    this._currentSortType = this._sortModel.getSortType();
    const updatedPresenter = this._filmsPresenters.find((item) => item._film.id === updatedFilmData.id);
    if (updatedPresenter) {
      updatedPresenter.init(updatedFilmData);
    }
    this._initExtraFilmsSection();
  }

  _initExtraFilmsSection() {
    // секция Top rated
    this._topRatedFilmsListComponent.getContainer().innerHTML = '';
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), getTopRatedFilms(this._filmsModel.getFilms()), this._topRatedPresenters);

    // секция Most commented
    this._mostCommentedFilmsListComponent.getContainer().innerHTML = '';
    this._renderFilmCards(this._mostCommentedFilmsListComponent.getContainer(), getMostCommentedFilms(this._filmsModel.getFilms()), this._mostCommentedPresenters);
  }

  showElement() {
    if (this._filmsComponent.getElement().classList.contains('visually-hidden')) {
      this._filmsComponent.getElement().classList.remove('visually-hidden');
    }
  }

  hideElement() {
    if (!this._filmsComponent.getElement().classList.contains('visually-hidden')) {
      this._filmsComponent.getElement().classList.add('visually-hidden');
    }
  }
}
