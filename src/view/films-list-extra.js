import Abstract from './abstract';

export const createFilmsListExtraTemplate = (title) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmsListExtra extends Abstract {
  constructor(title) {
    super();
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title);
  }
}
