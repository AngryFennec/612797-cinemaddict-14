import AbstractView from './abstract-view';

const SORT_ACTIVE_CLASS = 'sort__button--active';
export const createSortTemplate = (currentSort) => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSort === 'default' || !currentSort ? SORT_ACTIVE_CLASS : ''}" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSort === 'date' ? SORT_ACTIVE_CLASS : ''}" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSort === 'rating' ? SORT_ACTIVE_CLASS : ''}" data-sort="rating">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();
    this._currentSort = sortType;
    this._clickHandler = this._clickHandler.bind(this);
  //  this._init(currentSort);
  }

  // _init(currentSort) {
  //   this._removeActiveClass();
  //   switch (currentSort) {
  //     case 'date':
  //       this.getElement().querySelector('.sort__button[data-sort=date]').classList.add(SORT_ACTIVE_CLASS);
  //       break;
  //     case 'rating':
  //       this.getElement().querySelector('.sort__button[data-sort=rating]').classList.add(SORT_ACTIVE_CLASS);
  //       break;
  //     default:
  //       this.getElement().querySelector('.sort__button[data-sort=default]').classList.add(SORT_ACTIVE_CLASS);
  //       break;
  //   }
  // }

  getTemplate() {
    return createSortTemplate(this._currentSort);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _removeActiveClass() {
    const activeSortElement = this.getElement().querySelector(`.${SORT_ACTIVE_CLASS}`);
    if (activeSortElement) {
      activeSortElement.classList.remove(SORT_ACTIVE_CLASS);
    }
  }

  _clickHandler(evt) {
    evt.preventDefault();
    const clickedSortButton = evt.target.closest('.sort__button:not(.sort__button--active');
    if (!clickedSortButton) {
      return;
    }
    //this._removeActiveClass();
    //clickedSortButton.classList.add(SORT_ACTIVE_CLASS);
    this._callback.click(clickedSortButton.dataset.sort);
  }
}
