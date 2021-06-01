import FilmsModel from '../model/films.js';
import {isOnline} from '../utils/common.js';

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, storedFilms, storedComments) {
    this._api = api;
    this._store = store;
    this._storedFilms = storedFilms;
    this._storedComments = storedComments;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(this._storedFilms, items);
          return films;
        });
    }

    const storedFilms = this._getStoreFilms();

    return Promise.resolve(storedFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          this._store.setItem(this._storedComments, filmId, comments);
          return comments;
        });
    }

    const storeComments = this._store.getItems(this._storedComments)[filmId];

    if (storeComments) {
      return Promise.resolve(storeComments);
    }

    if (!this._getStoreFilms(filmId).comments || this._getStoreFilms(filmId).comments.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(this._storedFilms, updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(this._storedFilms, film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(filmId, comment) {
    if (isOnline()) {
      return this._api.addComment(filmId, comment)
        .then((response) => {
          this._store.setItem(this._storedFilms, filmId, FilmsModel.adaptToServer(response.movie));
          this._store.setItem(this._storedComments, filmId, response.comments);

          return {
            film: response.movie,
            comments: response.comments,
          };
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId, filmId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(this._storedComments, filmId, commentId));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = this._getStoreFilms();

      return this._api.sync(storeFilms)
        .then((response) => {
          const items = createStoreStructure(getSyncedFilms(response.updated));
          this._store.setItems(this._storedFilms, items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  _getStoreFilms(id) {
    return id ? Object.values(this._store.getItems(this._storedFilms))[id] : Object.values(this._store.getItems(this._storedFilms));
  }
}
