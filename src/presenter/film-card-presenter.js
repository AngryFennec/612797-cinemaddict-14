import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition, replace} from '../utils/render';
import {nanoid} from 'nanoid';
import {PopupAction} from '../utils/api';

const ESCAPE = 'Escape';

export default class FilmCardPresenter {
  constructor(film, container, changeData, filmsModel, api) {
    this._container = container;
    this._film = film;
    this._isPopupOpen = false;
    this._changeData = changeData;
    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onCloseEscPress = this._onCloseEscPress.bind(this);
    this._changeDetails = this._changeDetails.bind(this);
    this._filmsModel = filmsModel;
    this._api = api;
    this._changeData = this._changeData.bind(this);
    this._emoji = null;
    this._comment = '';
  }

  init(updatedData) {
    if (updatedData) {
      this._film = updatedData;
    }
    const newFilmCardInstance = new FilmCard(this._film);
    if (!this._filmCard) {
      this._filmCard = newFilmCardInstance;
      this._renderFilmCard();
      return;
    }
    replace(newFilmCardInstance, this._filmCard);
    this._filmCard = newFilmCardInstance;
    this._setFilmCardHandlers();

    if (this._isPopupOpen) {
      this._popup.updateData(this._prepareFilmToPopup(this._film));
    }
  }

  _openPopup() {
    this._api.getComments(this._film.id).then((response) => {
      this._filmsModel.setComments(response);
      this._popup = this._popup || new Popup(this._prepareFilmToPopup(this._film));
      this._isPopupOpen = true;
      document.body.appendChild(this._popup.getElement());
      this._setPopupHandlers();
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onCloseEscPress);
    });
  }

  _closePopup() {
    this._popup.getElement().remove();
    this._isPopupOpen = false;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onCloseEscPress);
    this._emoji = null;
    this._comment = '';
  }

  _setPopupHandlers() {
    this._popup.setEmojiChangeHandler((evt) => {
      this._emoji = evt.target.value;
      this._popup.updateData(this._prepareFilmToPopup(this._film));
    });

    this._popup.setCommentInputHandler((evt) => {
      this._comment = evt.target.value;
    });

    this._popup.setCommentDeleteHandler((evt) => {
      evt.preventDefault();

      const deletedId = evt.target.parentElement.dataset.comment;
      const updatedData = {
        film: this._film,
        commentId: deletedId,
      };
      this._changeData(PopupAction.DELETE_COMMENT, updatedData);
    });

    this._popup.setCommentSubmitHandler((evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
        if (!this._emoji || !this._comment.trim()) {
          return;
        }
        const commentId = nanoid();

        const updatedData = {
          comment: {
            id: commentId,
            comment: this._comment,
            emotion: this._emoji,
            author: 'Author',
            date: Date.now(), //реализация без дополнительного задания
          },
          film: this._film,
        };


        this._comment = '';
        this._emoji = null;
        this._changeData(PopupAction.ADD_COMMENT, updatedData);
      }
    });

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
    this._changeData(PopupAction.UPDATE_MOVIE, this._film);
  }

  _prepareFilmToPopup(film) {
    return Object.assign(
      {},
      film,
      {
        comments: this._filmsModel.getComments(),
        emoji: this._emoji || null,
        comment: this._comment || null,
        modifiedComment: {
          id: this._filmsModel.modifiedCommentId,
          isDeleteInProgress: this._filmsModel.isDeleteInProgress,
          isSubmitInProgress: this._filmsModel.isSubmitInProgress,
          isRequestError: this._filmsModel.isRequestError,
        },
      },
    );
  }
}
