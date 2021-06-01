import {getRandomInteger} from './utils/common';
import {toast} from './utils/toast';
import {getRandomString} from './utils/api';
import {render, RenderPosition} from './utils/render';
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

const filmsModel = new FilmsModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


apiWithProvider.getFilms().then((films) => {
  filmsModel.setFilms(films);
  // раздел с фильмами

  const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, apiWithProvider, siteHeaderElement);
  filmsPresenter.init();

  // статистика в футере
  render(document.body, new Footer(filmsModel.getFilms().length), RenderPosition.BEFOREEND);

});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
  toast('Connection restored');
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('Connection lost');
});
