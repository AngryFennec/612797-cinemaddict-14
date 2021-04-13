import {getRandomInteger, createElement} from '../utils';

const MAX_NAVIGATION_ITEM_VALUE = 20;

export const createNavigationTemplate = () => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export default class Navigation {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate();
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
