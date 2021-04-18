import Abstract from './abstract';

export const createShowMoreBtnTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreBtn extends Abstract {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this); // для обработчика, использующего this, всегда биндим контекст - он теряется, потому что this показывает на DOM
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  removeElement() {
    super.removeElement();
  }
}
