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
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storedFilms = Object.values(this._store.getItems());

    return Promise.resolve(storedFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }


  sync() {
    if (isOnline()) {
      const storedFilms = Object.values(this._store.getItems());
      return this._api.sync(storedFilms)
        .then((response) => {
          const items = createStoreStructure(getSyncedFilms(response.updated));
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync failed'));
  }

  _getStoredFilms() {
    return Object.values(this._store.getItems());
  }
}
