export const UserDetails = {
  'watchlist': 'watchlist',
  'watched': 'alreadyWatched',
  'favorite': 'favorite',
};

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
