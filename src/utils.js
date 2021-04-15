const MIN_YEAR_VALUE = 1920;

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

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


export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};
