import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition, replace} from '../utils/render';
import {nanoid} from 'nanoid';
import {CardAction, KeyValue, PopupAction} from '../const.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';

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
    this._isOfflineFormSubmit = false;
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
    if (!this._isPopupOpen && document.body.querySelector('.film-details')) {
      document.body.removeChild(document.body.querySelector('.film-details'));
    }

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
    this._emoji = null;
    this._comment = '';
    this._popup.updateData(this._prepareFilmToPopup(this._film));
    this._popup.getElement().remove();
    this._isPopupOpen = false;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onCloseEscPress);

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

      if (!isOnline()) {
        toast('You can\'t delete comment offline');
        return;
      }

      const deletedId = evt.target.parentElement.dataset.comment;
      const updatedData = {
        film: this._film,
        commentId: deletedId,
      };
      this._changeData(PopupAction.DELETE_COMMENT, updatedData);
    });

    this._popup.setCommentSubmitHandler((evt) => {

      if ((evt.ctrlKey || evt.metaKey) && evt.key === KeyValue.ENTER) {
        if (!this._emoji || !this._comment.trim()) {
          return;
        }

        if (!isOnline()) {
          this._isOfflineFormSubmit = true;
          this._filmsModel.setSubmitComplete();
          this._filmsModel.updateFilm(this._film, true);
          this._filmsModel.setRequestErrorReaction();
          toast('You can\'t save comment offline');
          setTimeout(() => {
            this._filmsModel.removeRequestErrorReaction();
            this._isOfflineFormSubmit = false;
          }, 200);
          return;
        }

        const commentId = nanoid();

        const updatedData = {
          comment: {
            id: commentId,
            comment: this._comment,
            emotion: this._emoji,
            author: 'Author',
            date: Date.now(),
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
    if (evt.key === KeyValue.ESCAPE) {
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
      case CardAction.WATCHLIST:
        this._film.userDetails.watchlist = !this._film.userDetails.watchlist;
        break;
      case CardAction.WATCHED:
        this._film.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
        break;
      case CardAction.FAVORITE:
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
          isRequestError: this._filmsModel.isRequestError || (!isOnline() && this._isOfflineFormSubmit),
        },
      },
    );
  }
}
