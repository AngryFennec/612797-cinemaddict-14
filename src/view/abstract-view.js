import {createElement} from '../utils/render';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) { // проверка на то, что не пытаемся создать экземпляр абстрактного класса
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('AbstractView method not implemented: getTemplate');
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

  showElement() {
    if (this._element.classList.contains('visually-hidden')) {
      this._element.classList.remove('visually-hidden');
    }
  }

  hideElement() {
    if (!this._element.classList.contains('visually-hidden')) {
      this._element.classList.add('visually-hidden');
    }
  }
}
