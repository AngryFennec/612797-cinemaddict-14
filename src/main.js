import {createShowMoreBtnTemplate} from './view/show-more.js';
import {createProfileTemplate} from './view/profile';
import {createNavigationTemplate} from './view/navigation';
import {createSortTemplate} from './view/sort';
import {createFilmsTemplate} from './view/films';
import {createFilmCardTemplate} from './view/film-card';
import {createFilmsListTemplate} from './view/films-list';
import {createFilmsListExtraTemplate} from './view/films-list-extra';
import {createPopupTemplate} from './view/popup';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {generateFilm} from './mock/film';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';
const TOP_RATED_MODIFIER = 'top-rated';
const MOST_COMMENTED_MODIFIER = 'most-commented';
const MOCK_FILMS_QUANTITY = 20;
const EXTRA_MOCK_FILMS_QUANTITY = 2;
const FILMS_PER_STEP = 5;


const renderFilmCards = (section, mocks) => {
  const containerElement = section.querySelector('.films-list__container');
  for (let i = 0; i < mocks.length; i++) {
    render(containerElement, createFilmCardTemplate(mocks[i]), 'beforeend');
  }
};

const getMostCommentedFilms = (films) => {
  return films.sort((a, b) => {
    return b.idComments.length - a.idComments.length;
  }).slice(0, EXTRA_MOCK_FILMS_QUANTITY);
};

const getTopRatedFilms = (films) => {
  return films.sort((a, b) => {
    return b.rating - a.rating;
  }).slice(0, EXTRA_MOCK_FILMS_QUANTITY);
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getNextRenderCardIterator = (filmsData) => {
  const cardAmount = filmsData.length;
  let renderedCardCount = 0;
  const renderItemAmount = 5;
  return {
    next() {
      const value = filmsData.slice(renderedCardCount, renderItemAmount + renderedCardCount);
      renderedCardCount += renderItemAmount;
      const done = renderedCardCount >= cardAmount;
      return {value, done};
    },
  };
};

// создание моковых массивов
const mockFilms = new Array(MOCK_FILMS_QUANTITY).fill().map(generateFilm);
const mockTopRatedFilms = getTopRatedFilms(mockFilms);
const mockMostCommentedFilms = getMostCommentedFilms(mockFilms);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

// профиль со званием
render(siteHeaderElement, createProfileTemplate(), 'beforeend');

// меню
render(siteMainElement, createNavigationTemplate(), 'beforeend');

//сортировка
render(siteMainElement, createSortTemplate(), 'beforeend');

// раздел с фильмами
render(siteMainElement, createFilmsTemplate(), 'beforeend');
const filmsElement = siteMainElement.querySelector('.films');

// основной список фильмов
render(filmsElement, createFilmsListTemplate(), 'beforeend');
const filmsListElement = filmsElement.querySelector('.films-list');

const iterator = getNextRenderCardIterator(mockFilms);
const {value: filmsPart} = iterator.next();

renderFilmCards(filmsListElement, filmsPart);

if (mockFilms.length > FILMS_PER_STEP) {
  render(filmsListElement, createShowMoreBtnTemplate(), 'beforeend');

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    const {value: filmsPart, done} = iterator.next();
    renderFilmCards(filmsListElement, filmsPart);

    if (done) {
      showMoreButton.remove();
    }
  });
}

renderFilmCards(filmsListElement, Math.min(mockFilms.length, FILMS_PER_STEP), mockFilms);

// секция Top rated
render(filmsElement, createFilmsListExtraTemplate(TOP_RATED_TITLE, TOP_RATED_MODIFIER), 'beforeend');
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${TOP_RATED_MODIFIER}`), mockTopRatedFilms);

// секция Most commented
render(filmsElement, createFilmsListExtraTemplate(MOST_COMMENTED_TITLE, MOST_COMMENTED_MODIFIER), 'beforeend');
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${MOST_COMMENTED_MODIFIER}`), mockMostCommentedFilms);

// статистика в футере
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, createFooterStatisticsTemplate(), 'beforeend');

// попап
const bodyElement = document.body;
render(bodyElement, createPopupTemplate(mockFilms[0]), 'beforeend');
