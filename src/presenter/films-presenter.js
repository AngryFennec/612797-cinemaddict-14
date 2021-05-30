import FilmsList from '../view/films-list';
import {PopupAction} from '../utils/api';
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
import Stats, {StatsType} from '../view/stats';
import FilmsModel from '../model/films';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;

export default class FilmsPresenter {
  constructor(container, filmsModel, api) {
    this._filmsContainer = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._filterModel = new FilterModel();
    this._sortModel = new SortModel();
    this._filmsComponent = new Films();
    this._filmsListComponent = null;
    this._statsComponent = null;
    this._mostCommentedFilmsListComponent = new FilmsListExtra(MOST_COMMENTED_TITLE);
    this._topRatedFilmsListComponent = new FilmsListExtra(TOP_RATED_TITLE);
    this._filmsEmptyListComponent = new FilmsEmptyList();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._filmsPresenters = [];
    this._topRatedPresenters = [];
    this._mostCommentedPresenters = [];
    this._sortPresenter = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._updateData = this._updateData.bind(this);
    this._updateStats = this._updateStats.bind(this);
  }

  init() {
    // меню
    const filterPresenter = new FilterPresenter(this._filmsContainer, this._filterModel, this._filmsModel);
    filterPresenter.init();
    //сортировка
    this._sortPresenter = new SortPresenter(this._filmsContainer, this._sortModel, this._filmsModel, this._filterModel);
    this._sortPresenter.init();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver((event, value) => {
      if (event === 'switchStats') {
        this._switchStats(value);
      }
    });

    this._sortModel.addObserver(this._handleModelEvent);

    this._initFilms();
  }

  _getFilms() {
    let filteredFilms = this._filmsModel.getFilms();
    switch (this._filterModel.getActiveFilter()) {
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
    this._filmsPresenters = [];

    this._renderFilms();

    // дополнительные секции
    render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._initExtraFilmsSection();
  }

  _renderFilmCards(container, films, filmsPresenters) {
    for (let i = 0; i < films.length; i++) {
      const filmCardPresenter = new FilmCardPresenter(films[i], container, this._updateData, this._filmsModel, this._api);
      filmCardPresenter.init();
      filmsPresenters.push(filmCardPresenter);
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
      this._filmsComponent.getElement().innerHTML = '';
      this._filmsListComponent = null;
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
  _updateData(actionType, updatedFilmData) {

    switch (actionType) {
      case PopupAction.UPDATE_MOVIE:
        this._api.updateFilm(FilmsModel.adaptToServer(updatedFilmData)).then((response) => {
          this._filmsModel.updateFilm(response);
        });
        break;
      case  PopupAction.ADD_COMMENT:
        this._api.addComment(updatedFilmData.comment, updatedFilmData.filmId).then((response) => {
          this._filmsModel.setComments(response.comments); // не обновляется список комментов в попапе
          this._filmsModel.updateFilm(response.movie);
        });
        break;
      case PopupAction.DELETE_COMMENT:
        this._api.deleteComment(updatedFilmData.commentId).then(() => {
          this._filmsModel.deleteComment(updatedFilmData.commentId);
          this._filmsModel.updateFilm(updatedFilmData.film, true);
        });
    }
  }

  _handleModelEvent(event, updatedFilmData) {

    if (event !== 'changeFilm') {
      return this._initFilms();
    }

    const actualIds = this._getFilms().slice(0, this._filmsPresenters.length).map((item) => item.id).toString();
    const currentIds = this._filmsPresenters.map((item) => item._film.id).toString();
    if (actualIds !== currentIds) {
      return this._initFilms();
    }
    const updatedPresenter = this._filmsPresenters.find((item) => item._film.id === updatedFilmData.id);
    const updatedTopRatedPresenter = this._topRatedPresenters.find((item) => item._film.id === updatedFilmData.id);
    const updatedMostCommentedPresenter = this._mostCommentedPresenters.find((item) => item._film.id === updatedFilmData.id);
    this._updatePresenter(updatedPresenter, updatedFilmData);
    this._updatePresenter(updatedTopRatedPresenter, updatedFilmData);
    this._updatePresenter(updatedMostCommentedPresenter, updatedFilmData);
    this._initExtraFilmsSection();
  }

  _initExtraFilmsSection() {
    this._topRatedPresenters = [];
    this._mostCommentedPresenters = [];
    // секция Top rated
    this._topRatedFilmsListComponent.getContainer().innerHTML = '';
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), getTopRatedFilms(this._filmsModel.getFilms()), this._topRatedPresenters);

    // секция Most commented
    this._mostCommentedFilmsListComponent.getContainer().innerHTML = '';
    this._renderFilmCards(this._mostCommentedFilmsListComponent.getContainer(), getMostCommentedFilms(this._filmsModel.getFilms()), this._mostCommentedPresenters);
  }

  showElement() {
    this._filmsComponent.show();
  }

  hideElement() {
    this._filmsComponent.hide();
  }

  _switchStats(menuItem) {
    if (menuItem === 'stats') {
      this._updateStats(null);
      this._statsComponent.show();
      this.hideElement();
    } else {
      if (this._statsComponent) {
        this._statsComponent.hide();
      }
      this.showElement();
    }
  }

  _updatePresenter(presenter, data) {
    if (presenter) {
      presenter.init(data);
    }
  }

  _updateStats(period) {
    const periodProp = period ? period : StatsType.ALL;
    const newStatsInstance = new Stats(this._filmsModel.getFilms(), periodProp);
    if (!this._statsComponent) {
      this._statsComponent = newStatsInstance;
      render(this._filmsContainer, this._statsComponent, RenderPosition.BEFOREEND);
    } else {
      replace(newStatsInstance, this._statsComponent);
      this._statsComponent = newStatsInstance;
    }
    this._statsComponent.setFilterClickHandler(this._updateStats);
  }

}
