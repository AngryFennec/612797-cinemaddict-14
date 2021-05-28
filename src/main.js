import {generateFilm} from './mock/film';
import {getRandomInteger, getRandomString} from './utils/common';
import {render, RenderPosition, replace} from './utils/render';
import Profile from './view/profile';
import Stats, {StatsType} from './view/stats';
import Footer from './view/footer';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films';
import Api from './api';

const MOCK_FILMS_QUANTITY = 20;
const MAX_FILMS_QUANTITY = 100000;

const AUTHORIZATION_STRING_LENGTH = 16;
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const basicString = getRandomString(AUTHORIZATION_STRING_LENGTH);
const authorizationString = `Basic ${basicString}`;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

let statsComponent;

const menuClickHandler = (menuItem) => {
  if (menuItem === 'stats') {
    updateStats(null);
    statsComponent.showElement();
    filmsPresenter.hideElement();
  } else {
    if (statsComponent) {
      statsComponent.hideElement();
    }
    filmsPresenter.showElement();
  }
};

const updateStats = (period) => {
  const periodProp = period ? period : StatsType.ALL;
  const newStatsInstance = new Stats(filmsModel.getFilms(), periodProp);
  if (!statsComponent) {
    statsComponent = newStatsInstance;
    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
  } else {
    replace(newStatsInstance, statsComponent);
    statsComponent = newStatsInstance;
  }
  statsComponent.setFilterClickHandler(updateStats);
};


// const api = new Api(END_POINT, authorizationString);
// api.getFilms().then((films) => {
//   console.log(films);
// });

// создание моковых массивов
//const mockFilms = new Array(MOCK_FILMS_QUANTITY).fill().map((_, i) => generateFilm(i));

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();
//filmsModel.setFilms(mockFilms);

const api = new Api(END_POINT, authorizationString);
api.getFilms().then((films) => {
  filmsModel.setFilms(films);

  // раздел с фильмами
  const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, menuClickHandler);
  filmsPresenter.init();
});

// статистика в футере
render(document.body, new Footer(getRandomInteger(1000, MAX_FILMS_QUANTITY)), RenderPosition.BEFOREEND);


