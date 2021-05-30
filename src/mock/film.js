import {
  getRandomArrayElement,
  getRandomInteger, generateRandomDate, getSubArray
} from '../utils/common';
import {generateComment} from './comment';

const MAX_DESCRIPTION = 140;
const MAX_AGE_VALUE = 19;
const MAX_QUANTITY_VALUE = 5;
const MAX_MINUTES_VALUE = 300;

const MOCK_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const MOCK_POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const MOCK_TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const MOCK_ORIGINAL_TITLES = [
  'The Dance of Life Original',
  'Sagebrush Trail Original',
  'The Man with the Golden Arm Original',
  'Santa Claus Conquers the Martians Original',
  'Popeye the Sailor Meets Sindbad the Sailor Original',
  'The Great Flamarion Original',
  'Made for Each Other Original',
];

const MOCK_GENRES = ['musical', 'comedy', 'action', 'shooter', 'psycho'];

const MOCK_PERSONS = [
  'Antonio Banderas',
  'Pedro Almodovar',
  'Vicente Aranda',
  'Nacho Vigalondo',
  'Yon Gonzalez',
  'Hugo Silva',
  'Angela Molina',
  'Blanca Suarez',
];

const MOCK_COUNTRIES = [
  'Espana',
  'UK',
  'USA',
  'Germany',
  'Greece',
  'Italy',
];

const generateDescription = () => {
  const quantity = getRandomInteger(1, 5);
  return getSubArray(quantity, MOCK_SENTENCES).join(' ');
};

const generateCommentsArray = () => {
  const quantity = getRandomInteger(0, MAX_QUANTITY_VALUE);
  const comments = [];
  for (let i = 0; i < quantity; i++) {
    comments.push(generateComment());
  }
  return comments;
};

const generateRating = () => {
  return (Math.random() * 10).toFixed(1);
};

const getShortDescription = (description) => {
  return description.length <= MAX_DESCRIPTION ? description : `${description.substring(0, MAX_DESCRIPTION)}...`;
};

const getCommentsIdArray = (comments) => {
  return comments.map((item) => item.id);
};


export const generateFilm = (id) => {
  const description = generateDescription();
  const commentsArray = generateCommentsArray();
  const randomDate = generateRandomDate();
  return {
    id: parseInt(id),
    posterUrl: getRandomArrayElement(MOCK_POSTERS),
    title: getRandomArrayElement(MOCK_TITLES),
    rating: generateRating(),
    year: randomDate.getFullYear(),
    duration: getRandomInteger(1, MAX_MINUTES_VALUE),
    genre: getRandomArrayElement(MOCK_GENRES),
    shortDescription: getShortDescription(description),
    fullPosterUrl: getRandomArrayElement(MOCK_POSTERS),
    originalTitle: getRandomArrayElement(MOCK_ORIGINAL_TITLES),
    producer: getRandomArrayElement(MOCK_PERSONS),
    screenWriters: getSubArray(getRandomInteger((1, MAX_QUANTITY_VALUE)), MOCK_PERSONS),
    actors: getSubArray(getRandomInteger((1, MAX_QUANTITY_VALUE)), MOCK_PERSONS),
    date: randomDate,
    rawDate: randomDate,
    country: getRandomArrayElement(MOCK_COUNTRIES),
    genres: getSubArray(getRandomInteger((1, MAX_QUANTITY_VALUE)), MOCK_GENRES),
    fullDescription: description,
    ageLimit: getRandomInteger(0, MAX_AGE_VALUE),
    comments: commentsArray,
    idComments: getCommentsIdArray(commentsArray),
    userDetails: {
      watchlist: Math.random() >= 0.5,
      alreadyWatched: Math.random() >= 0.5,
      favorite: Math.random() >= 0.5,
    },
  };
};
