import Observer from '../utils/observer.js';
import {getShortDescription} from '../utils/api';

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

  updateFilm(updatedFilm, isNoResponse) {
    // isNoResponse отвечает за необходимость конвертировать фильм с серверного формата в формат клиента
    const updateData = isNoResponse ? updatedFilm : FilmsModel.adaptToClient(updatedFilm);
    const index = this._films.findIndex((film) => film.id === updateData.id);

    if (index === -1) {
      throw new Error('no film');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateData,
      ...this._films.slice(index + 1),
    ];

    this._notify('changeFilm', updateData);
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      {
        'id': film.id,
        'comments': film.idComments,
        'film_info': {
          'poster': film.posterUrl,
          'title': film.title,
          'alternative_title': film.originalTitle,
          'total_rating': film.rating,
          'director': film.producer,
          'writers': film.screenWriters,
          'age_rating': film.ageLimit,
          'genre': film.genres,
          'runtime': film.duration,
          'actors': film.actors,
          'description': film.fullDescription,
          'release': {
            'date': film.rawDate,
            'release_country': film.country,
          },
        },
        'user_details': {
          'watchlist': film.userDetails.watchlist,
          'already_watched': film.userDetails.alreadyWatched,
          'watching_date': film.userDetails.watchingDate,
          'favorite': film.userDetails.favorite,
        },
      },
    );
    return adaptedFilm;
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        posterUrl: film.film_info.poster,
        title: film.film_info.title,
        originalTitle: film.film_info.alternative_title,
        rating: film.film_info.total_rating,
        producer: film.film_info.director,
        fullPosterUrl: film.film_info.poster,
        ageLimit: film.film_info.age_rating,
        duration: film.film_info.runtime,
        genres: film.film_info.genre,
        genre: film.film_info.genre[0],
        screenWriters: film.film_info.writers,
        actors: film.film_info.actors,
        fullDescription: film.film_info.description,
        shortDescription: getShortDescription(film.film_info.description),
        country: film.film_info.release.release_country,
        rawDate: new Date(film.film_info.release.date),
        date: new Date(film.film_info.release.date),
        year: new Date(film.film_info.release.date).getFullYear(),
        idComments: film.comments,
        userDetails: {
          watchlist: film.user_details.watchlist,
          alreadyWatched: film.user_details.already_watched,
          favorite: film.user_details.favorite,
          watchingDate: new Date(film.user_details.watching_date),
        },
      });

    delete adaptedFilm.user_details;
    delete adaptedFilm.film_info;
    delete adaptedFilm.comments;
    return adaptedFilm;
  }
}
