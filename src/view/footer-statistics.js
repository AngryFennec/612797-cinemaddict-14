import {formatNumber, getRandomInteger} from '../utils/common';
import AbstractView from './abstract-view';

const MAX_FILMS_QUANTITY = 100000;

export const createFooterStatisticsTemplate = () => {
  return `<p> ${formatNumber(getRandomInteger(1000, MAX_FILMS_QUANTITY))} movies inside</p>`;
};

export default class FooterStatistics extends AbstractView {
  getTemplate() {
    return createFooterStatisticsTemplate();
  }
}
