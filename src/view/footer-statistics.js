import {formatNumber, getRandomInteger} from '../utils';

const MAX_FILMS_QUANTITY = 100000;

export const createFooterStatisticsTemplate = () => {
  return `<p> ${formatNumber(getRandomInteger(1000, MAX_FILMS_QUANTITY))} movies inside</p>`;
};

