import {generateFilm} from './mock/film';
import {getRandomInteger} from './utils/common';
import {render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Stats from './view/stats';
import Footer from './view/footer';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films';

const MOCK_FILMS_QUANTITY = 20;
const MAX_FILMS_QUANTITY = 100000;

// создание моковых массивов
const mockFilms = new Array(MOCK_FILMS_QUANTITY).fill().map((_, i) => generateFilm(i));


const filmsModel = new FilmsModel();
filmsModel.setFilms(mockFilms);

let statsComponent;

const menuClickHandler = (menuItem) => {
  if (menuItem === 'stats') {
    statsComponent = new Stats();// filmsModel.getFilms()
    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
    statsComponent.showElement();
    filmsPresenter.hideElement();
  } else {
    if (statsComponent) {
      statsComponent.getElement().remove();
    }
    filmsPresenter.showElement();
  }
};


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);


// раздел с фильмами
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, menuClickHandler);
filmsPresenter.init();

// статистика в футере
render(document.body, new Footer(getRandomInteger(1000, MAX_FILMS_QUANTITY)), RenderPosition.BEFOREEND);


