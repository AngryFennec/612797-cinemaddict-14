import FilmsList from '../view/films-list';
import {EventType, FilterType, PopupAction, SortType, StatsType} from '../const.js';
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
import Stats from '../view/stats';
import FilmsModel from '../model/films';
import Profile from '../view/profile';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;

export default class FilmsPresenter {
  constructor(container, filmsModel, api, profileContainer) {
    this._filmsContainer = container;
    this._profileContainer = profileContainer;
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
    this._wasZeroRating = false;
    this._wasZeroComments = false;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._updateData = this._updateData.bind(this);
    this._updateStats = this._updateStats.bind(this);
  }

  init() {
    // ??????????????
    this._renderProfile();
    // ????????
    const filterPresenter = new FilterPresenter(this._filmsContainer, this._filterModel, this._filmsModel);
    filterPresenter.init();
    //????????????????????
    this._sortPresenter = new SortPresenter(this._filmsContainer, this._sortModel, this._filmsModel, this._filterModel);
    this._sortPresenter.init();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver((event, value) => {
      if (event === EventType.SWITCH_STATS) {
        this._switchStats(value);
      }
    });

    this._sortModel.addObserver(this._handleModelEvent);

    this._initFilms();
  }

  _getFilms() {
    let filteredFilms = this._filmsModel.getFilms();
    switch (this._filterModel.getActiveFilter()) {
      case FilterType.WATCHLIST:
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.watchlist);
        break;
      case FilterType.HISTORY:
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.alreadyWatched);
        break;
      case FilterType.FAVORITES:
        filteredFilms = this._filmsModel.getFilms().filter((item) => item.userDetails.favorite);
        break;
    }

    switch (this._sortModel.getSortType()) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
      default:
        return filteredFilms.sort(sortById);
    }
  }

  _renderProfile() {
    // ?????????????? ???? ??????????????
    this._profileContainer.innerHTML = '';
    render(this._profileContainer, new Profile(this._filmsModel.getFilms()), RenderPosition.BEFOREEND);

  }

  _initFilms() {
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._filmsPresenters = [];

    this._renderFilms();

    // ???????????????????????????? ????????????
    if (!this._isZeroRating()) {
      render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
    } else {
      this._wasZeroRating = true;
    }
    if (!this._isZeroComments()) {
      render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
    } else {
      this._wasZeroComments = true;
    }

    if (!this._isZeroRating() || !this._isZeroComments()) {
      this._initExtraFilmsSection();
    }
  }

  _isZeroRating() {
    const zeroRatingFilms = this._filmsModel.getFilms().filter((item) => item.rating === 0);
    return zeroRatingFilms && this._filmsModel.getFilms().length === zeroRatingFilms.length;
  }

  _isZeroComments() {
    const zeroCommentsFilms = this._filmsModel.getFilms().filter((item) => item.idComments.length === 0);
    return zeroCommentsFilms && this._filmsModel.getFilms().length === zeroCommentsFilms.length;
  }

  _renderFilmCards(container, films, filmsPresenters) {
    films.forEach((item) => {
      const filmCardPresenter = new FilmCardPresenter(item, container, this._updateData, this._filmsModel, this._api);
      filmCardPresenter.init();
      filmsPresenters.push(filmCardPresenter);
    });
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

  // ?? ???????????????? ???????????? ?????? ?????????????????? ???????????? ????????????
  _updateData(actionType, updatedFilmData) {

    switch (actionType) {
      case PopupAction.UPDATE_MOVIE:
        this._api.updateFilm(FilmsModel.adaptToServer(updatedFilmData)).then((response) => {
          this._filmsModel.updateFilm(response);
          this._renderProfile();
        });
        break;
      case  PopupAction.ADD_COMMENT:
        this._filmsModel.setSubmitInProgress();
        this._filmsModel.updateFilm(updatedFilmData.film, true);
        this._api.addComment(updatedFilmData.comment, updatedFilmData.film.id).then((response) => {
          this._filmsModel.setComments(response.comments);
          this._filmsModel.setSubmitComplete();
          this._filmsModel.updateFilm(response.movie);
        }).catch(() => {
          this._filmsModel.setSubmitComplete();
          this._filmsModel.setRequestErrorReaction();
          this._filmsModel.updateFilm(updatedFilmData.film, true);
          this._filmsModel.removeRequestErrorReaction();
          this._filmsModel.updateFilm(updatedFilmData.film, true);
        });
        break;
      case PopupAction.DELETE_COMMENT:
        this._filmsModel.setDeleteInProgress(updatedFilmData.commentId);
        this._filmsModel.updateFilm(updatedFilmData.film, true);
        this._api.deleteComment(updatedFilmData.commentId, updatedFilmData.film.id).then(() => {
          const updatedFilmAfterDelete = JSON.parse(JSON.stringify(updatedFilmData));
          updatedFilmAfterDelete.film.idComments = updatedFilmData.film.idComments.filter((item) => item !== updatedFilmData.commentId);
          this._filmsModel.deleteComment(updatedFilmData.commentId);
          this._filmsModel.updateFilm(updatedFilmAfterDelete.film, true);
          this._filmsModel.setDeleteComplete();
        }).catch(() => {
          this._filmsModel.setDeleteComplete();
          this._filmsModel.setRequestErrorReaction();
          this._filmsModel.updateFilm(updatedFilmData.film, true);
          this._filmsModel.removeRequestErrorReaction();
          this._filmsModel.updateFilm(updatedFilmData.film, true);
        });
    }
  }

  _handleModelEvent(event, updatedFilmData) {

    if (event !== EventType.CHANGE_FILM) {
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

    if (this._wasZeroRating && !this._isZeroRating()) {
      render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
      this._wasZeroRating = false;
    }

    if (this._wasZeroComments && !this._isZeroComments()) {
      render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
      this._wasZeroComments = false;
    }
    this._initExtraFilmsSection();
  }

  _initExtraFilmsSection() {
    this._topRatedPresenters = [];
    this._mostCommentedPresenters = [];
    // ???????????? Top rated
    this._topRatedFilmsListComponent.getContainer().innerHTML = '';
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), getTopRatedFilms(this._filmsModel.getFilms()), this._topRatedPresenters);

    // ???????????? Most commented
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
