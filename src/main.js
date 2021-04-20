import {generateFilm} from './mock/film';
import {getRandomInteger} from './utils/common';
import {render, RenderPosition} from './utils/render';
import ShowMoreBtn from './view/show-more-btn';
import Profile from './view/profile';
import FilmCard from './view/film-card';
import Navigation from './view/navigation';
import Films from './view/films';
import FilmsList from './view/films-list';
import FilmsListExtra from './view/films-list-extra';
import FooterStatistics from './view/footer-statistics';
import Popup from './view/popup';
import Sort from './view/sort';
import FilmsEmptyList from './view/films-empty-list';

const MAX_NAVIGATION_ITEM_VALUE = 20;

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const MOCK_FILMS_QUANTITY = 20;
const EXTRA_MOCK_FILMS_QUANTITY = 2;
const FILMS_PER_STEP = 5;

const ESCAPE = 'Escape';


const renderFilmCard = (containerElement, film) => {
  const openPopup = () => {
    newPopup = newPopup || new Popup(film);
    document.body.appendChild(newPopup.getElement());
    newPopup.setCloseClickHandler(closePopup);
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
  let newPopup;

  render(containerElement, newFilmCard, RenderPosition.BEFOREEND);
  newFilmCard.setClickHandler(openPopup);

};

const renderFilmCards = (container, mocks) => {
  for (let i = 0; i < mocks.length; i++) {
    renderFilmCard(container, mocks[i]);
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
  const renderItemAmount = FILMS_PER_STEP;
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
render(siteHeaderElement, new Profile(), RenderPosition.BEFOREEND);

// меню
render(siteMainElement, new Navigation(getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE), getRandomInteger(1, MAX_NAVIGATION_ITEM_VALUE)), RenderPosition.BEFOREEND);

//сортировка
render(siteMainElement, new Sort(), RenderPosition.BEFOREEND);

// раздел с фильмами
const films = new Films();
render(siteMainElement, films, RenderPosition.BEFOREEND);
const filmsElement = films.getElement();

// основной список фильмов
if (mockFilms && mockFilms.length > 0) {

  const filmsList = new FilmsList();
  render(filmsElement, filmsList, RenderPosition.BEFOREEND);
  const filmsListElement = filmsList.getElement();

  const iterator = getNextRenderCardIterator(mockFilms);
  const {value: filmsPart} = iterator.next();

  renderFilmCards(filmsList.getContainer(), filmsPart);

  if (mockFilms.length > FILMS_PER_STEP) {
    const showMoreButton = new ShowMoreBtn();
    render(filmsListElement, showMoreButton, RenderPosition.BEFOREEND);

    showMoreButton.setClickHandler(() => {
      const {value: filmsPart, done} = iterator.next();
      renderFilmCards(filmsList.getContainer(), filmsPart);

      if (done) {
        showMoreButton.getElement().remove();
        showMoreButton.removeElement();
      }
    });
  }

  // дополнительные секции
  const topRatedFilms = new FilmsListExtra(TOP_RATED_TITLE);
  render(filmsElement, topRatedFilms, RenderPosition.BEFOREEND);

  const mostCommentedFilms = new FilmsListExtra(MOST_COMMENTED_TITLE);
  render(filmsElement, mostCommentedFilms, RenderPosition.BEFOREEND);

  // секция Top rated
  renderFilmCards(topRatedFilms.getContainer(), mockTopRatedFilms);

  // секция Most commented
  renderFilmCards(mostCommentedFilms.getContainer(), mockMostCommentedFilms);
} else {
  render(filmsElement, new FilmsEmptyList(), RenderPosition.BEFOREEND);
}
// статистика в футере
const footerStatisticsElement = document.querySelector('.footer__statistics');
render(footerStatisticsElement, new FooterStatistics(), RenderPosition.BEFOREEND);
