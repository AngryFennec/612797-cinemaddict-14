import AbstractView from './abstract-view';

const SORT_ACTIVE_CLASS = 'sort__button--active';
export const createSortTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort="rating">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
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
    if (evt.target.tagName === 'UL') {
      return;
    }
    const clickTarget = evt.target.tagName === 'LI' ? evt.target.firstElementChild : evt.target;
    if (!clickTarget.classList.contains(SORT_ACTIVE_CLASS)) {
      this._removeActiveClass();
      clickTarget.classList.add(SORT_ACTIVE_CLASS);
      this._callback.click(clickTarget.dataset.sort);
    }
  }
}
