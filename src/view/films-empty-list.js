import {createElement} from '../utils';

export const createFilmsEmptyListTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`;
};

export default class FilmsEmptyList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsEmptyListTemplate();
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
