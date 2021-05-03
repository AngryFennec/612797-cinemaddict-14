import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition} from '../utils/render';

const ESCAPE = 'Escape';

export default class FilmCardPresenter {
  constructor(container, film) {
    this._container = container;
    this._film = film;
    this._filmCard = new FilmCard(this._film);
    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onCloseEscPress = this._onCloseEscPress.bind(this);
    this._addToWatchlist = this._addToWatchlist.bind(this);
    this._addToFavorite = this._addToFavorite.bind(this);
    this._addToAlreadyWatched = this._addToAlreadyWatched.bind(this);
  }

  _openPopup() {
    this._popup = this._popup || new Popup(this._film);
    document.body.appendChild(this._popup.getElement());
    this._popup.setCloseClickHandler(this._closePopup);
    this._popup.setAddToWatchlistChangeHandler(this._addToWatchlist);
    this._popup.setAddToAlreadyWatchedChangeHandler(this._addToAlreadyWatched);
    this._popup.setAddToFavoriteChangeHandler(this._addToFavorite);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onCloseEscPress);
  }

  _closePopup() {
    document.body.removeChild(this._popup.getElement());
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onCloseEscPress);
  }

  _addToWatchlist() {
    this._film.userDetails.watchlist = !this._film.userDetails.watchlist;
    this._filmCard.changeAddToWatchlistBtnState();
  }

  _addToFavorite() {
    this._film.userDetails.favorite = !this._film.userDetails.favorite;
    this._filmCard.changeAddToAlreadyWatchedBtnState();
  }

  _addToAlreadyWatched() {
    this._film.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
    this._filmCard.changeAddToFavoriteBtnState();
  }

  _onCloseEscPress(evt) {
    if (evt.key === ESCAPE) {
      this._closePopup();
    }
  }

  _renderFilmCard() {
    render(this._container, this._filmCard, RenderPosition.BEFOREEND);
    this._filmCard.setClickHandler(this._openPopup);
    this._filmCard.setAddToWatchlistClickHandler(this._addToWatchlist);
    this._filmCard.setAddToAlreadyWatchedClickHandler(this._addToAlreadyWatched);
    this._filmCard.setAddToFavoriteClickHandler(this._addToFavorite);
  }
}
