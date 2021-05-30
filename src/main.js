import {getRandomInteger, getRandomString} from './utils/common';
import {render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Footer from './view/footer';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films';
import CommentsModel from './model/comments';
import Api from './api';

// const MOCK_FILMS_QUANTITY = 20;
const MAX_FILMS_QUANTITY = 100000;

const AUTHORIZATION_STRING_LENGTH = 16;
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const basicString = getRandomString(AUTHORIZATION_STRING_LENGTH);
const authorizationString = `Basic ${basicString}`;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


// создание моковых массивов
//const mockFilms = new Array(MOCK_FILMS_QUANTITY).fill().map((_, i) => generateFilm(i));

// профиль со званием
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
//filmsModel.setFilms(mockFilms);

const api = new Api(END_POINT, authorizationString);
api.getFilms().then((films) => {
  filmsModel.setFilms(films);
  // раздел с фильмами
  const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, api);
  filmsPresenter.init();
});

// статистика в футере
render(document.body, new Footer(getRandomInteger(1000, MAX_FILMS_QUANTITY)), RenderPosition.BEFOREEND);


