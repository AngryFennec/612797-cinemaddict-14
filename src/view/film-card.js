import Abstract from './abstract';

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

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._element = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
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
}
