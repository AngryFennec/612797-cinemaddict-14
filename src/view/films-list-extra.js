import {createElement} from '../utils';

export const createFilmsListExtraTemplate = (title, modifier) => {
  return `<section class="films-list films-list--extra films-list--${modifier}">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmsListExtra {
  constructor(title, modifier) {
    this._title = title;
    this._modifier = modifier;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title, this._modifier);
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
