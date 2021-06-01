import AbstractView from './abstract-view';
import {FilterType} from '../const.js';

const FILTER_ACTIVE_CLASS = 'main-navigation__item--active';

export const createNavigationTemplate = (watchListCount, historyCount, favoritesCount, activeItem) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${activeItem === FilterType.ALL ? FILTER_ACTIVE_CLASS : ''}" data-filter="all">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${activeItem === FilterType.WATCHLIST ? FILTER_ACTIVE_CLASS : ''}" data-filter="watchlist">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
      <a href="#history" class="main-navigation__item ${activeItem === FilterType.HISTORY ? FILTER_ACTIVE_CLASS : ''}" data-filter="history">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item  ${activeItem === FilterType.FAVORITES ? FILTER_ACTIVE_CLASS : ''}"  data-filter="favorites">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>
    <a href="#stats" data-filter="stats" class="main-navigation__additional  ${activeItem === 'stats' ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`;
};

export default class Filter extends AbstractView{
  constructor(filterCounts, activeFilter) {
    super();
    const {watchlistCount, historyCount, favoritesCount} = filterCounts;
    this._element = null;
    this._watchListCount = watchlistCount;
    this._historyCount = historyCount;
    this._favoritesCount = favoritesCount;
    this._activeFilter = activeFilter;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._watchListCount, this._historyCount, this._favoritesCount, this._activeFilter);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    const clickedFilter = evt.target.closest('.main-navigation__item');
    const clickedMenu = evt.target.closest('.main-navigation__additional');
    if (!clickedFilter && !clickedMenu) {
      return;
    }

    if (clickedFilter) {
      this._callback.click(clickedFilter.dataset.filter);
      return;
    }

    if (clickedMenu) {
      this._callback.click('stats');
      return;
    }
  }


  setClickHandler(callbackNavigation, callbackMenu) {
    this._callback.click = callbackNavigation;
    this._callback.menuClick = callbackMenu;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._clickHandler);
  }
}
