import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition, replace} from '../utils/render';
import {nanoid} from 'nanoid';

const ESCAPE = 'Escape';

export default class FilmCardPresenter {
  constructor(film, container) {
    this._container = container;
    this._film = film;
    this._isPopupOpen = false;
    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onCloseEscPress = this._onCloseEscPress.bind(this);
    this._changeDetails = this._changeDetails.bind(this);
    this._changePopupScroll = this._changePopupScroll.bind(this);
    this._popupScroll = 0;
    this._emoji = null;
    this._comment = '';
  }

  init() {
    const newFilmCardInstance = new FilmCard(this._film);
    if (!this._filmCard) {
      this._filmCard = newFilmCardInstance;
      this._renderFilmCard();
      return;
    }
    replace(newFilmCardInstance, this._filmCard);
    this._filmCard = newFilmCardInstance;
    this._setFilmCardHandlers();

    //const newPopupInstance = new Popup(this._prepareFilmToPopup(this._film));
    // здесь пришлось сделать If-else, потому что в прежнем порядке обработчики устанавливались не на тот инстанс
    // if (!this._isPopupOpen) {
    //   this._popup = newPopupInstance;
    // } else {
    //   this._popup.updateData(this._prepareFilmToPopup(this._film));
    //  // this._setPopupHandlers();
    //  // this._popup.setScrollPosition(this._popupScroll);
    // }

    if (this._isPopupOpen) {
      this._popup.updateData(this._prepareFilmToPopup(this._film));
      this._setPopupHandlers();
    }

  }

  _openPopup() {
    this._popup = this._popup || new Popup(this._film);
    this._isPopupOpen = true;
    document.body.appendChild(this._popup.getElement());
    this._setPopupHandlers();
    this._popup.setScrollPosition(this._popupScroll);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onCloseEscPress);
  }

  _closePopup() {
    this._popup.getElement().remove();
    this._isPopupOpen = false;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onCloseEscPress);
    this._popupScroll = 0;
    this._emoji = null;
    this._comment = null;
  }

  _setPopupHandlers() {
    this._popup.setEmojiChangeHandler((evt) => {
      evt.preventDefault();
      this._emoji = evt.target.value;
      this._popup.updateData(this._prepareFilmToPopup(this._film));
    });

    this._popup.setCommentInputHandler((evt) => {
      this._comment = evt.target.value;
      this._popup.updateData(this._prepareFilmToPopup(this._film));
    });

    this._popup.setCommentSubmitHandler((evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
        if (!this._emoji || !this._comment.trim()) {
          return;
        }

        const commentId = nanoid();

        this._film.comments.push({
          id: commentId,
          text: this._comment,
          emotion: this._emoji,
          author: 'Author',
          date: '',
        });

        this._film.idComments.push(commentId);

        this._film.commentsQuantity = this._film.comments.length;
        this._comment = '';
        this._emoji = null;
        this._popup.updateData(this._prepareFilmToPopup(this._film));
      }

    });

    this._popup.setScrollChangeHandler(this._changePopupScroll);
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

  _changePopupScroll(evt) {
    this._popupScroll = evt.target.scrollTop;
  }

  _prepareFilmToPopup(film) {
    return Object.assign(
      {},
      film,
      {
        emoji: this._emoji,
        comment: this._comment,
      },
    );
  }
}
