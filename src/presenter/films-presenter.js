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
import Sort from '../view/sort';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;

export default class FilmsPresenter {
  constructor(container, filmsModel, filterModel) {
    this._filmsContainer = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsComponent = new Films();
    this._filmsListComponent = null;
    this._sortComponent = new Sort();
    this._currentSortType = 'default';
    this._mostCommentedFilmsListComponent = new FilmsListExtra(MOST_COMMENTED_TITLE);
    this._topRatedFilmsListComponent = new FilmsListExtra(TOP_RATED_TITLE);
    this._filmsEmptyListComponent = new FilmsEmptyList();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._sortFilms = this._sortFilms.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    //сортировка
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._sortComponent.setClickHandler(this._sortFilms);

    this._initFilms();
  }

  _getFilms() {
    let filteredFilms = this._filmsModel.getFilms().slice();
    switch(this._filterModel.getActiveFilter()) {
      case 'watchlist':
        filteredFilms = this._filmsModel.getFilms().slice().filter((item) => item.userDetails.watchlist);
        break;
      case 'history':
        filteredFilms = this._filmsModel.getFilms().slice().filter((item) => item.userDetails.alreadyWatched);
        break;
      case 'favorites':
        filteredFilms = this._filmsModel.getFilms().slice().filter((item) => item.userDetails.favorite);
        break;
    }

    switch (this._currentSortType) {
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

    // секция Top rated
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), getTopRatedFilms(this._filmsModel.getFilms()));

    // секция Most commented
    this._renderFilmCards(this._mostCommentedFilmsListComponent.getContainer(), getMostCommentedFilms(this._filmsModel.getFilms()));
  }

  _renderFilmCards(container, films) {
    for (let i = 0; i < films.length; i++) {
      const filmCardPresenter = new FilmCardPresenter(films[i], container, this._handleModelEvent);
      filmCardPresenter.init();
    }
  }

  _renderShowMoreButton(iterator) {
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const {value: filmsPart, done} = iterator.next();
      this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

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
    this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

    if (this._getFilms().length > FILMS_PER_STEP) {
      this._renderShowMoreButton(iterator);
    }
  }

  _sortFilms(sortType) {
    this._currentSortType = sortType;
    this._renderFilms();
  }

  _handleModelEvent() {
    this._initFilms();
  }
}
