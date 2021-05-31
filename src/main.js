import {getRandomInteger, getRandomString} from './utils/common';
import {render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Footer from './view/footer';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films';
import Api from './api/api';
import Store from './api/store.js';
import Provider from './api/provider.js';

const MAX_FILMS_QUANTITY = 100000;

const AUTHORIZATION_STRING_LENGTH = 16;
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const basicString = getRandomString(AUTHORIZATION_STRING_LENGTH);
const authorizationString = `Basic ${basicString}`;

const api = new Api(END_POINT, authorizationString);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();


apiWithProvider.getFilms().then((films) => {
  filmsModel.setFilms(films);
  // раздел с фильмами
  const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, apiWithProvider);
  filmsPresenter.init();
});

// статистика в футере
render(document.body, new Footer(getRandomInteger(1000, MAX_FILMS_QUANTITY)), RenderPosition.BEFOREEND);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
