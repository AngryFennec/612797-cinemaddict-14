import {generateFilm} from './mock/film';
import {RenderPosition, render} from './utils.js';
import ShowMore from './view/show-more';
import Profile from './view/profile';
import FilmCard from './view/film-card';
import Navigation from './view/navigation';
import Films from './view/films';
import FilmsList from './view/films-list';
import FilmsListExtra from './view/films-list-extra';
import FooterStatistics from './view/footer-statistics';
import Popup from './view/popup';
import Sort from './view/sort';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';
const TOP_RATED_MODIFIER = 'top-rated';
const MOST_COMMENTED_MODIFIER = 'most-commented';
const MOCK_FILMS_QUANTITY = 20;
const EXTRA_MOCK_FILMS_QUANTITY = 2;
const FILMS_PER_STEP = 5;

const ESCAPE = 'Escape';


const renderFilmCard = (containerElement, film) => {
  const openPopup = () => {
    document.body.appendChild(newPopup.getElement());
    const closeBtn = newPopup.getElement().querySelector('.film-details__close');
    closeBtn.addEventListener('click', closePopup);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onCloseEscPress);
  };

  const closePopup = () => {
    document.body.removeChild(newPopup.getElement());
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onCloseEscPress);
  };

  const onCloseEscPress = (evt) => {
    if (evt.key === ESCAPE) {
      closePopup();
    }
  };

  const newFilmCard = new FilmCard(film);
  const newPopup = new Popup(film);

  render(containerElement, newFilmCard.getElement(), RenderPosition.BEFOREEND);
  const filmTitleElement = newFilmCard.getElement().querySelector('.film-card__title');
  filmTitleElement.addEventListener('click', () => {
    openPopup();
  });
  const filmPosterElement = newFilmCard.getElement().querySelector('.film-card__poster');
  filmPosterElement.addEventListener('click', () => {
    openPopup();
  });
  const filmCommentsElement = newFilmCard.getElement().querySelector('.film-card__comments');
  filmCommentsElement.addEventListener('click', () => {
    openPopup();
  });

};

const renderFilmCards = (section, mocks) => {
  const containerElement = section.querySelector('.films-list__container');
  for (let i = 0; i < mocks.length; i++) {
    renderFilmCard(containerElement, mocks[i]);
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
render(siteHeaderElement, new Profile().getElement(), RenderPosition.BEFOREEND);

// меню
render(siteMainElement, new Navigation().getElement(), RenderPosition.BEFOREEND);

//сортировка
render(siteMainElement, new Sort().getElement(), RenderPosition.BEFOREEND);

// раздел с фильмами
render(siteMainElement, new Films().getElement(), RenderPosition.BEFOREEND);
const filmsElement = siteMainElement.querySelector('.films');

// основной список фильмов
render(filmsElement, new FilmsList().getElement(), RenderPosition.BEFOREEND);
const filmsListElement = filmsElement.querySelector('.films-list');

const iterator = getNextRenderCardIterator(mockFilms);
const {value: filmsPart} = iterator.next();

renderFilmCards(filmsListElement, filmsPart);

if (mockFilms.length > FILMS_PER_STEP) {
  render(filmsListElement, new ShowMore().getElement(), RenderPosition.BEFOREEND);

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
render(filmsElement, new FilmsListExtra(TOP_RATED_TITLE, TOP_RATED_MODIFIER).getElement() , RenderPosition.BEFOREEND);
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${TOP_RATED_MODIFIER}`), mockTopRatedFilms);

// секция Most commented
render(filmsElement, new FilmsListExtra(MOST_COMMENTED_TITLE, MOST_COMMENTED_MODIFIER).getElement(), RenderPosition.BEFOREEND);
renderFilmCards(filmsElement.querySelector(`.films-list--extra.films-list--${MOST_COMMENTED_MODIFIER}`), mockMostCommentedFilms);

// статистика в футере
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, new FooterStatistics().getElement(), RenderPosition.BEFOREEND);
