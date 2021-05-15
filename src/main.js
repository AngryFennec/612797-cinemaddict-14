import {generateFilm} from './mock/film';
import {getRandomInteger} from './utils/common';
import {render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Navigation from './view/navigation';
import Footer from './view/footer';
import FilmsPresenter from './presenter/films-presenter';

const MAX_NAVIGATION_ITEM_VALUE = 20;
const MOCK_FILMS_QUANTITY = 20;
const MAX_FILMS_QUANTITY = 100000;


// создание моковых массивов
const mockFilms = [];
for (let i = 0; i < MOCK_FILMS_QUANTITY; i++) {
  mockFilms.push(generateFilm(i));
}

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

// меню
render(siteMainElement, new Navigation(getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)), RenderPosition.BEFOREEND);

// раздел с фильмами
const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(mockFilms);

// статистика в футере
render(document.body, new Footer(getRandomInteger(1000, MAX_FILMS_QUANTITY)), RenderPosition.BEFOREEND);
