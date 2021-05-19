import AbstractView from './abstract-view';
import {UserDetails} from '../utils/presenter';
import {getFormattedDuration} from '../utils/common';

const BTN_ACTIVE_CLASS = 'film-card__controls-item--active';

const Modificators = {
  'watchlist': 'add-to-watchlist',
  'watched': 'mark-as-watched',
  'favorite': 'favorite',
};

export const createFilmCardTemplate = (film) => {
  return `<article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${getFormattedDuration(film.duration)}</span>
      <span class="film-card__genre">${film.genre}</span>
    </p>
    <img src="images/posters/${film.posterUrl}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.shortDescription}</p>
    <a class="film-card__comments">${film.idComments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._setClickBtnHandler = this._setClickBtnHandler.bind(this);
    this.renewButtons();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  changeBtnState(property) {
    const btn = this.getElement().querySelector(`.film-card__controls-item--${Modificators[property]}`);
    if (this._film.userDetails[UserDetails[property]] && !btn.classList.contains(BTN_ACTIVE_CLASS)) {
      btn.classList.add(BTN_ACTIVE_CLASS);
      return;
    }
    if (!this._film.userDetails[UserDetails[property]]) {
      btn.classList.remove(BTN_ACTIVE_CLASS);
    }
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    const filmTitleElement = this.getElement().querySelector('.film-card__title');
    filmTitleElement.addEventListener('click', this._clickHandler);

    const filmPosterElement = this.getElement().querySelector('.film-card__poster');
    filmPosterElement.addEventListener('click', this._clickHandler);

    const filmCommentsElement = this.getElement().querySelector('.film-card__comments');
    filmCommentsElement.addEventListener('click', this._clickHandler);
  }

  _setClickBtnHandler(property) {
    return () => { // стрелочная функция для this
      this._callback.changeDetails(property);
      this.changeBtnState(property);
    };
  }

  setChangeDetailsCallback(callback) {
    this._callback.changeDetails = callback;
    const addToWatchlistBtn = this.getElement().querySelector(`.film-card__controls-item--${Modificators['watchlist']}`);
    addToWatchlistBtn.addEventListener('click', this._setClickBtnHandler('watchlist'));

    const addToAlreadyWatchedBtn = this.getElement().querySelector(`.film-card__controls-item--${Modificators['watched']}`);
    addToAlreadyWatchedBtn.addEventListener('click', this._setClickBtnHandler('watched'));

    const addToFavoriteBtn = this.getElement().querySelector(`.film-card__controls-item--${Modificators['favorite']}`);
    addToFavoriteBtn.addEventListener('click', this._setClickBtnHandler('favorite'));
  }

  renewButtons() {
    this.changeBtnState('watchlist');
    this.changeBtnState('watched');
    this.changeBtnState('favorite');
  }
}
