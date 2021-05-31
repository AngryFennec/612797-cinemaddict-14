import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const MIN_YEAR_VALUE = 1920;

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getShuffledArray = (array) => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [shuffledArray[i], shuffledArray[randomPosition]] = [shuffledArray[randomPosition], shuffledArray[i]];
  }
  return shuffledArray;
};

export const getSubArray = (quantity, array) => {
  return quantity > array ? array : getShuffledArray(array).slice(0, quantity);
};

export const generateRandomDate = () => {
  const start = new Date(MIN_YEAR_VALUE, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
  return dayjs(date).format('YYYY/MM/DD HH:mm');
};

export const getFormattedReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const getUserRank = (films) => {
  const watchedFilms = films.length;
  switch (true) {
    case watchedFilms >= 1 && watchedFilms <= 10:
      return 'novice';
    case watchedFilms >= 11 && watchedFilms <= 20:
      return 'fan';
    case watchedFilms >= 21:
      return 'movie buff';
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

export const getRandomString = (length) => {
  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
};

export const isOnline = () => {
  return window.navigator.onLine;
};
