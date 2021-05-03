import AbstractView from './abstract-view';

const BTN_ACTIVE_CLASS = 'film-card__controls-item--active';

export const createFilmCardTemplate = (film) => {
  return `<article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${film.duration}</span>
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
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
    this._addToAlreadyWatchedClickHandler = this._addToAlreadyWatchedClickHandler.bind(this);
    this._addToFavoriteClickHandler = this._addToFavoriteClickHandler.bind(this);
    this.renewButtons();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  changeAddToWatchlistBtnState() {
    const addToWatchlistBtn = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
    if (this._film.userDetails.watchlist && !addToWatchlistBtn.classList.contains(BTN_ACTIVE_CLASS)) {
      addToWatchlistBtn.classList.add(BTN_ACTIVE_CLASS);
      return;
    }
    if (!this._film.userDetails.watchlist) {
      addToWatchlistBtn.classList.remove(BTN_ACTIVE_CLASS);
    }
  }

  changeAddToAlreadyWatchedBtnState() {
    const addToAlreadyWatchedBtn = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    if (this._film.userDetails.alreadyWatched && !addToAlreadyWatchedBtn.classList.contains(BTN_ACTIVE_CLASS)) {
      addToAlreadyWatchedBtn.classList.add(BTN_ACTIVE_CLASS);
      return;
    }
    if (!this._film.userDetails.alreadyWatched) {
      addToAlreadyWatchedBtn.classList.remove(BTN_ACTIVE_CLASS);
    }
  }

  changeAddToFavoriteBtnState() {
    const addToFavoriteBtn = this.getElement().querySelector('.film-card__controls-item--favorite');
    if (this._film.userDetails.favorite && !addToFavoriteBtn.classList.contains(BTN_ACTIVE_CLASS)) {
      addToFavoriteBtn.classList.add(BTN_ACTIVE_CLASS);
      return;
    }
    if (!this._film.userDetails.favorite) {
      addToFavoriteBtn.classList.remove(BTN_ACTIVE_CLASS);
    }  }

  _addToWatchlistClickHandler() {
    this._callback.addToWatchlistClick();
    this.changeAddToWatchlistBtnState();
  }

  _addToAlreadyWatchedClickHandler() {
    this._callback.addToAlreadyWatchedClick();
    this.changeAddToAlreadyWatchedBtnState();
  }

  _addToFavoriteClickHandler() {
    this._callback.addToFavoriteClick();
    this.changeAddToFavoriteBtnState();
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

  setAddToWatchlistClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    const addToWatchlistBtn = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
    addToWatchlistBtn.addEventListener('click', this._addToWatchlistClickHandler);
  }

  setAddToAlreadyWatchedClickHandler(callback) {
    this._callback.addToAlreadyWatchedClick = callback;
    const addToAlreadyWatchedBtn = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    addToAlreadyWatchedBtn.addEventListener('click', this._addToAlreadyWatchedClickHandler);
  }

  setAddToFavoriteClickHandler(callback) {
    this._callback.addToFavoriteClick = callback;
    const addToFavoriteBtn = this.getElement().querySelector('.film-card__controls-item--favorite');
    addToFavoriteBtn.addEventListener('click', this._addToFavoriteClickHandler);
  }

  renewButtons() {
    this.changeAddToWatchlistBtnState();
    this.changeAddToAlreadyWatchedBtnState();
    this.changeAddToFavoriteBtnState();
  }
}
