import AbstractView from './abstract-view';

export const FilterValues = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const createNavigationTemplate = (watchListCount, historyCount, favoritesCount) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item" data-filter="all">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-filter="watchlist">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
      <a href="#history" class="main-navigation__item" data-filter="history">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item" data-filter="favorites">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export default class Navigation extends AbstractView{
  constructor(films, activeFilter) {
    super();
    this._element = null;
    this._watchListCount = films.filter((item) => item.userDetails.watchlist).length;
    this._historyCount = films.filter((item) => item.userDetails.alreadyWatched).length;
    this._favoritesCount = films.filter((item) => item.userDetails.favorite).length;
    this._activeFilter = activeFilter;
    this._clickHandler = this._clickHandler.bind(this);
    this.setActiveFilter();
  }

  getTemplate() {
    return createNavigationTemplate(this._watchListCount, this._historyCount, this._favoritesCount);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    const clickedFilter = evt.target.closest('.main-navigation__item');
    if (!clickedFilter) {
      return;
    }
    const filters = Array.from(this.getElement().querySelectorAll('.main-navigation__item'));
    filters.forEach((item) => item.classList.remove('main-navigation__item--active'));
    clickedFilter.classList.add('main-navigation__item--active');
    this._callback.click(clickedFilter.dataset.filter);
  }

  setActiveFilter() {
    const filters = Array.from(this.getElement().querySelectorAll('.main-navigation__item'));
    filters.forEach((item) => item.classList.remove('main-navigation__item--active'));
    const activeElement = filters.find((item) => item.dataset.filter === this._activeFilter);
    activeElement.classList.add('main-navigation__item--active');
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._clickHandler);
  }
}
