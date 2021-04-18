import Abstract from './abstract';

export const createNavigationTemplate = (watchListCount, historyCount, favoritesCount) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
};

export default class Navigation extends Abstract{
  constructor(watchListCount, historyCount, favoritesCount) {
    super();
    this._element = null;
    this._watchListCount = watchListCount;
    this._historyCount = historyCount;
    this._favoritesCount = favoritesCount;
  }

  getTemplate() {
    return createNavigationTemplate(this._watchListCount, this._historyCount, this._favoritesCount);
  }
}
