import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff',
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const formatNumber = (num) => {
  if (num < 1000) {
    return num;
  }

  let result = '' + num % 1000;
  let dividend = Math.floor(num / 1000);
  while (dividend >= 1000) {
    result = dividend % 1000 + ' ' + result;
    dividend = Math.floor(dividend / 1000);
  }
  result = dividend + ' ' + result;
  return result;
};

export const getFormattedDuration = (duration) => {
  return dayjs.duration({hour: Math.floor(duration / 60), minute: duration % 60}).format('H[h ]mm[m]');
};

export const getFormattedCommentDate = (date) => {
  return dayjs(date).fromNow();
};

export const getFormattedReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const getUserRank = (films) => {
  const watchedFilms = films.length;
  switch (true) {
    case watchedFilms >= 1 && watchedFilms <= 10:
      return UserRank.NOVICE;
    case watchedFilms >= 11 && watchedFilms <= 20:
      return UserRank.FAN;
    case watchedFilms >= 21:
      return UserRank.MOVIE_BUFF;
    default:
      return '';
  }
};

export const getDuration = (films) => {
  return films.reduce((sum, current) => {
    return sum + current.duration;
  }, 0);
};

export const getMostPopularGenre = (films) => {
  const genresCount = getGenresCount(films);
  return  genresCount && genresCount.length > 0 ? genresCount[0][0] : '';
};

export const getGenresCount = (films) => {
  const genresCount = {};
  films.forEach((item) => {
    const itemGenres = item.genres;
    itemGenres.forEach((genre) => {

      let currentCount = 1;
      if (Object.keys(genresCount) && Object.keys(genresCount).indexOf(genre) !== -1 ) {
        currentCount += genresCount[genre];
      }
      genresCount[genre] = currentCount;
    });

  });
  const sorted = [];
  for (const genre in genresCount) {
    sorted.push([genre, genresCount[genre]]);
  }

  sorted.sort((a, b) => {
    return b[1] - a[1];
  });

  return sorted;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
