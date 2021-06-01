const EXTRA_FILMS_QUANTITY = 2;

export function getNextRenderCardIterator(filmsData, renderItemAmount) {
  const cardAmount = filmsData.length;
  let renderedCardCount = 0;
  return {
    next() {
      const value = filmsData.slice(renderedCardCount, renderItemAmount + renderedCardCount);
      renderedCardCount += renderItemAmount;
      const done = renderedCardCount >= cardAmount;
      return {value, done};
    },
  };
}

export function getTopRatedFilms(films) {
  return films.sort(sortByRating).slice(0, EXTRA_FILMS_QUANTITY);
}

export function getMostCommentedFilms(films) {
  return films.sort((a, b) => {
    return b.idComments.length - a.idComments.length;
  }).slice(0, EXTRA_FILMS_QUANTITY);
}

export function sortById(a, b) {
  return a.id - b.id;
}

export function sortByDate(a, b) {
  return b.rawDate.getTime() - a.rawDate.getTime();
}

export function sortByRating(a, b) {
  return b.rating - a.rating;
}
