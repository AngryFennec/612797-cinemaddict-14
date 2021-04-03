export const createFilmsListExtraTemplate = (title, modifier) => {
  return `<section class="films-list films-list--extra films-list--${modifier}">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`;
};
