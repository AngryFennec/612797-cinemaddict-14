import {generateFilm} from './mock/film';
import {getRandomInteger} from './utils/common';
import {render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Navigation from './view/navigation';
import FooterStatistics from './view/footer-statistics';
import Sort from './view/sort';
import FilmsPresenter from './presenter/films-presenter';

const MAX_NAVIGATION_ITEM_VALUE = 20;

const MOCK_FILMS_QUANTITY = 20;

// создание моковых массивов
const mockFilms = new Array(MOCK_FILMS_QUANTITY).fill().map(generateFilm);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

// меню
render(siteMainElement, new Navigation(getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)), RenderPosition.BEFOREEND);

//сортировка
render(siteMainElement, new Sort(), RenderPosition.BEFOREEND);

// раздел с фильмами
const filmsPresenter = new FilmsPresenter(siteMainElement);
filmsPresenter.init(mockFilms);
// статистика в футере
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, new FooterStatistics(), RenderPosition.BEFOREEND);
