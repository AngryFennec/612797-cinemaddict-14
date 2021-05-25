import Observer from '../utils/observer.js';

export default class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films.slice();
  }

  updateFilm(updateData) {
    const index = this._films.findIndex((film) => film.id === updateData.id);

    if(index === -1) {
      throw new Error('no film');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateData,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateData);
  }
}
