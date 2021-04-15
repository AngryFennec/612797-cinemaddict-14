import {formatNumber, getRandomInteger, createElement} from '../utils';

const MAX_FILMS_QUANTITY = 100000;

export const createFooterStatisticsTemplate = () => {
  return `<p> ${formatNumber(getRandomInteger(1000, MAX_FILMS_QUANTITY))} movies inside</p>`;
};

export default class FooterStatistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
