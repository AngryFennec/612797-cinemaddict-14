import {generateRandomDate, getRandomArrayElement, getRandomInteger, getSubArray} from '../utils/common';

const MIN_ID_VALUE = 100000;
const MAX_ID_VALUE = 999999;
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const AUTHORS = ['Churchill', 'Kennedy', 'Socrates', 'Martin Luther King Jr', 'Baldwin', 'Koni'];
const TEXT_SENTENCES = [
  'Так себе.',
  'Я бы сделал лучше.',
  'Считаю, это шедевр!',
  'Можно смотреть только с попкорном.',
  'Великолепный фильм, который должен увидеть каждый.',
  'Средний уровень, для развлечения подойдет.',
  'Раньше снимали лучше :(',
];

const getFormattedDate = () => {
  const randomDate = generateRandomDate();
  return `${randomDate.getFullYear()}/${randomDate.getMonth() + 1}/${randomDate.getDate()} ${getRandomInteger(0, 23)}:${getRandomInteger(0, 59)}`;
};

const generateCommentText = () => {
  const quantity = getRandomInteger(1, 3);
  return getSubArray(quantity, TEXT_SENTENCES).join(' ');
};

export const generateComment = () => {
  return {
    id: getRandomInteger(MIN_ID_VALUE, MAX_ID_VALUE),
    text: generateCommentText(),
    emotion: getRandomArrayElement(EMOTIONS),
    author: getRandomArrayElement(AUTHORS),
    date: getFormattedDate(),
  };
};
