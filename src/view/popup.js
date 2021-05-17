import {UserDetails} from '../utils/presenter';
import SmartView from './smart-view';
import { nanoid } from 'nanoid';

const createGenreItemTemplate = (item) => {
  return `<span class="film-details__genre">${item}</span>`;
};

const createGenresTemplate = (genres) => {
  const template = genres.map((item) => createGenreItemTemplate(item)).join(' ');
  return `<td class="film-details__cell">${template}</td>`;
};

const createCommentTemplate = (comment) => {
  return `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
                </span>
                <div>
                  <p class="film-details__comment-text">${comment.text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${comment.date}</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>`;
};

const createCommentsTemplate = (comments, fullComments) => {
  const commentsById = comments.map((id) => fullComments.find((item) => item.id === id));
  const template = commentsById.map((item) => createCommentTemplate(item)).join(' ');
  return `<ul class="film-details__comments-list">${template}</ul>`;
};

export const createPopupTemplate = (film) => {
  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${film.fullPosterUrl}" alt="">
              <p class="film-details__age">${film.ageLimit}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${film.title}</h3>
                  <p class="film-details__title-original">${film.originalTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${film.rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${film.producer}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${film.screenWriters.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${film.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${film.date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${film.duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${film.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  ${createGenresTemplate(film.genres)}
                </tr>
              </table>
              <p class="film-details__film-description">
                ${film.fullDescription}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.userDetails.watchlist ? 'checked' : ''}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.userDetails.alreadyWatched ? 'checked' : ''}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.userDetails.favorite ? 'checked' : ''}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.idComments.length}</span></h3>
            ${createCommentsTemplate(film.idComments, film.comments)}
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${film.emoji ? `<img src="images/emoji/${film.emoji}.png" width="55" height="55" alt="emoji-${film.emoji}">` : ''}</div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${film.comment ? film.comment : ''}</textarea>
              </label>
              <div class="film-details__emoji-list">
              ${['smile', 'sleeping', 'puke', 'angry'].map((item) => {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${item}" value="${item}">
                <label class="film-details__emoji-label" for="emoji-${item}">
                  <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
                </label>`;
  }).join('\n')}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);
    this._element = null;
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._setChangeInputHandler = this._setChangeInputHandler.bind(this);
    this._setCommentsBlockHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  _closeClickHandler() {
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    const closeBtn = this.getElement().querySelector('.film-details__close-btn');
    closeBtn.addEventListener('click', this._closeClickHandler);
  }

  _setChangeInputHandler(property) {
    return () => { // стрелочная функция для this
      this._callback.changeDetails(property);
      this.getElement().querySelector(`#${property}`).checked = this._data.userDetails[UserDetails[property]];
    };
  }

  setChangeDetailsCallback(callback) {
    this._callback.changeDetails = callback;

    const addToWatchlistInput = this.getElement().querySelector('#watchlist');
    addToWatchlistInput.addEventListener('change', this._setChangeInputHandler('watchlist'));

    const addToAlreadyWatchedInput = this.getElement().querySelector('#watched');
    addToAlreadyWatchedInput.addEventListener('change', this._setChangeInputHandler('watched'));

    const addToFavoriteInput = this.getElement().querySelector('#favorite');
    addToFavoriteInput.addEventListener('change', this._setChangeInputHandler('favorite'));
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        emoji: null,
        comment: '',
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    delete data.comment;
    delete data.emoji;
    return data;
  }

  reset(film) {
    this.updateData(
      Popup.parseFilmToData(film),
    );
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.value,
      scrollPosition: this.getElement().scrollTop,
    });
  }

  _commentInputHandler(evt) {
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _commentSubmitHandler(evt) {
    if (!(evt.ctrlKey || evt.metaKey) || evt.key !== 'Enter') {
      return;
    }
    if (!this._data || !this._data.emoji || !this._data.comment.trim()) {
      return;
    }

    const commentId = nanoid();

    this._data.comments.push({
      id: commentId,
      text: this._data.comment,
      emotion: this._data.emoji,
      author: 'Author',
      date: '',
    });

    this._data.idComments.push(commentId);

    this._data.commentsQuantity = this._data.comments.length;

    this._data = Popup.parseFilmToData(this._data);
    this.updateElement();
  }

  _setEmojiChangeHandler() {
    const emojiElements = Array.from(this.getElement().querySelectorAll('.film-details__emoji-item'));
    emojiElements.forEach((item) => item.addEventListener('change', this._emojiChangeHandler));
  }

  _setCommentInputHandler() {
    const commentElements = Array.from(this.getElement().querySelectorAll('.film-details__comment-input'));
    commentElements.forEach((item) => item.addEventListener('input', this._commentInputHandler));
  }

  _setCommentSubmitHandler() {
    this.getElement().addEventListener('keydown', this._commentSubmitHandler);
  }

  _setCommentsBlockHandlers() {
    this._setEmojiChangeHandler();
    this._setCommentInputHandler();
    this._setCommentSubmitHandler();
  }

  _setScrollPosition() {
    if(this._data.scrollPosition !== 0) {
      this.getElement().scrollTop = this._data.scrollPosition;
    }
  }

  restoreHandlers() {
    this._setCommentsBlockHandlers();
    this.setChangeDetailsCallback(this._callback.changeDetails);
    this.setCloseClickHandler(this._callback.closeClick);
    this._setScrollPosition();
  }
}
