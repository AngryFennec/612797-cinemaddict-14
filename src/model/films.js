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

  updateFilm(updateData) {
    const index = this._films.findIndex((film) => film.id === updateData.id);

    if (index === -1) {
      throw new Error('no film');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateData,
      ...this._films.slice(index + 1),
    ];

    this._notify(null, updateData);
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
        ageRating: film.film_info.age_limit,
        duration: film.film_info.runtime,
        genres: film.film_info.genre,
        genre: film.film_info.genre[0],
        screenWriters: film.film_info.writers,
        actors: film.film_info.actors,
        fullDesctiption: film.film_info.description,
        shortDescription: getShortDescription(film.film_info.description),
        country: film.film_info.release.release_country,
        rawDate: new Date(film.film_info.release.date),
        date: new Date(film.film_info.release.date),
        year: new Date(film.film_info.release.date).getFullYear(),
        commentsQuantity: film.comments.length,
        idComments: film.comments,


        userDetails: {
          watchlist: film.user_details.watchlist,
          alreadyWatched: film.user_details.already_watched,
          favorite: film.user_details.favorite,
          watchingDate: film.user_details.watching_date,
        },
      });

    delete adaptedFilm.user_details;
    delete adaptedFilm.film_details;
    delete adaptedFilm.comments;
    return adaptedFilm;
  }
}

// {
//
//   "comments": [
//     {
//       "id": "1Ikvf_l_XCQTN8nMiN8BS",
//       "text": "Я бы сделал лучше. Средний уровень, для развлечения подойдет. Так себе.",
//       "emotion": "angry",
//       "author": "Kennedy",
//       "date": "1942/1/24 14:8"
//     },
//     {
//       "id": "uFRiZsnEq3LuyNTyejm7u",
//       "text": "Раньше снимали лучше :( Так себе.",
//       "emotion": "sleeping",
//       "author": "Koni",
//       "date": "1992/2/27 21:2"
//     },
//     {
//       "id": "gx1cBLXrX-yz6pOQKpM7L",
//       "text": "Можно смотреть только с попкорном. Так себе. Я бы сделал лучше.",
//       "emotion": "angry",
//       "author": "Koni",
//       "date": "1958/5/1 3:28"
//     },
//     {
//       "id": "-4LbwB47leEIfI5HSOAfb",
//       "text": "Считаю, это шедевр! Раньше снимали лучше :( Средний уровень, для развлечения подойдет.",
//       "emotion": "puke",
//       "author": "Kennedy",
//       "date": "2003/3/26 21:32"
//     },
//     {
//       "id": "pXG_RQTkujVqXGpia94nA",
//       "text": "Я бы сделал лучше.",
//       "emotion": "puke",
//       "author": "Churchill",
//       "date": "1940/3/17 14:22"
//     }
//   ],
//

// }
//
// // {
// //

// //   "comments": [
// //     "20549",
// //     "20550",
// //     "20551",
// //     "20552",
// //     "20553"
// //   ]
// // }
// //
// //
// //     // Ненужные ключи мы удаляем
// //     delete adaptedTask.due_date;
// //     delete adaptedTask.is_archived;
// //     delete adaptedTask.is_favorite;
// //     delete adaptedTask.repeating_days;
// //
// //     return adaptedTask;
// //   }
// //
// //   static adaptToServer(task) {
// //     const adaptedTask = Object.assign(
// //       {},
// //       task,
// //       {
// //         'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
// //         'is_archived': task.isArchive,
// //         'is_favorite': task.isFavorite,
// //         'repeating_days': task.repeating,
// //       },
// //     );
// //
// //     // Ненужные ключи мы удаляем
// //     delete adaptedTask.dueDate;
// //     delete adaptedTask.isArchive;
// //     delete adaptedTask.isFavorite;
// //     delete adaptedTask.repeating;
// //
// //     return adaptedTask;
// //   }
// }
