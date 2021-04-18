import Abstract from './abstract';

export const createFilmsEmptyListTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`;
};

export default class FilmsEmptyList extends Abstract {
  getTemplate() {
    return createFilmsEmptyListTemplate();
  }
}
