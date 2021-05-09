import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition, replace} from '../utils/render';

const ESCAPE = 'Escape';

export default class FilmCardPresenter {
  constructor(container, film) {
    this._container = container;
    this._film = film;
    this._isPopupOpen = false;
    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onCloseEscPress = this._onCloseEscPress.bind(this);
    this._changeDetails = this._changeDetails.bind(this);
  }

  init() {
    const newFilmCardInstance = new FilmCard(this._film);
    if (!this._filmCard) {
      this._filmCard = newFilmCardInstance;
      this._renderFilmCard();
      return;
    }
    replace(newFilmCardInstance, this._filmCard);
    this._filmCard.getElement().remove();
    this._filmCard = newFilmCardInstance;
    this._setFilmCardHandlers();

    const newPopupInstance = new Popup(this._film);
    if (this._isPopupOpen) {
      replace(newPopupInstance, this._popup);
    }
    this._popup.getElement().remove();
    this._popup = newPopupInstance;
  }

  _openPopup() {
    this._popup = this._popup || new Popup(this._film);
    this._isPopupOpen = true;
    document.body.appendChild(this._popup.getElement());
    this._setPopupHandlers();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onCloseEscPress);
  }

  _closePopup() {
    this._popup.getElement().remove();
    this._isPopupOpen = false;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onCloseEscPress);
  }

  _setPopupHandlers() {
    this._popup.setCloseClickHandler(this._closePopup);
    this._popup.setChangeDetailsCallback(this._changeDetails);
  }

  _onCloseEscPress(evt) {
    if (evt.key === ESCAPE) {
      this._closePopup();
    }
  }

  _renderFilmCard() {
    render(this._container, this._filmCard, RenderPosition.BEFOREEND);
    this._setFilmCardHandlers();
  }

  _setFilmCardHandlers() {
    this._filmCard.setClickHandler(this._openPopup);
    this._filmCard.setChangeDetailsCallback(this._changeDetails);
  }

  _changeDetails(property) {
    switch (property) {
      case 'watchlist':
        this._film.userDetails.watchlist = !this._film.userDetails.watchlist;
        break;
      case 'watched':
        this._film.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
        break;
      case 'favorite':
        this._film.userDetails.favorite = !this._film.userDetails.favorite;
        break;
    }
    this.init();
  }
}
