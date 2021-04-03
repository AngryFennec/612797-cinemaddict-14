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

const EXTRA_FILMS_QUANTITY = 2;
const FILMS_QUANTITY = 5;
const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';
const TOP_RATED_MODIFIER = 'top-rated';
const MOST_COMMENTED_MODIFIER = 'most-commented';

const renderFilmCards = (section, quantity) => {
  const containerElement = section.querySelector('.films-list__container');
  for (let i = 0; i < quantity; i++) {
    render(containerElement, createFilmCardTemplate(), 'beforeend');
  }
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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
renderFilmCards(filmsListElement, FILMS_QUANTITY);
render(filmsListElement, createShowMoreBtnTemplate(), 'beforeend');

// секция Top rated
render(filmsElement, createFilmsListExtraTemplate(TOP_RATED_TITLE, TOP_RATED_MODIFIER), 'beforeend');
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${TOP_RATED_MODIFIER}`), EXTRA_FILMS_QUANTITY);

// секция Most commented
render(filmsElement, createFilmsListExtraTemplate(MOST_COMMENTED_TITLE, MOST_COMMENTED_MODIFIER), 'beforeend');
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${MOST_COMMENTED_MODIFIER}`), EXTRA_FILMS_QUANTITY);

// статистика в футере
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, createFooterStatisticsTemplate(), 'beforeend');

// попап
const bodyElement = document.body;
render(bodyElement, createPopupTemplate(), 'beforeend');
