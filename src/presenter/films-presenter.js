import FilmsList from '../view/films-list';
import Popup from '../view/popup';
import FilmCard from '../view/film-card';
import {render, RenderPosition} from '../utils/render';
import Films from '../view/films';
import FilmsListExtra from '../view/films-list-extra';
import FilmsEmptyList from '../view/films-empty-list';
import ShowMoreBtn from '../view/show-more-btn';

const ESCAPE = 'Escape';
const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;
const EXTRA_MOCK_FILMS_QUANTITY = 2;

export default class FilmsPresenter {
  constructor(container) {
    this._filmsContainer = container;
    this._films = null;
    this._filmsComponent = new Films();
    this._filmsListComponent = new FilmsList();
    this._mostCommentedFilmsListComponent = new FilmsListExtra(MOST_COMMENTED_TITLE);
    this._topRatedFilmsListComponent = new FilmsListExtra(TOP_RATED_TITLE);
    this._filmsEmptyListComponent = new FilmsEmptyList();
    this._showMoreButtonComponent = new ShowMoreBtn();
  }

  init(films) {
    this._films = films.slice(); // копируем в презентер массив фильмов
    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderFilms();
  }


  _renderFilmCard(containerElement, film) {
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

  }

  _renderFilmCards(container, mocks) {
    for (let i = 0; i < mocks.length; i++) {
      this._renderFilmCard(container, mocks[i]);
    }
  }

  _getNextRenderCardIterator(filmsData) {
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
  }


  _renderShowMoreButton(iterator) {
    render(this._filmsComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const {value: filmsPart, done} = iterator.next();
      this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

      if (done) {
        this._showMoreButtonComponent.getElement().remove();
        this._showMoreButtonComponent.removeElement();
      }
    });
  }

  _getMostCommentedFilms() {
    return this._films.sort((a, b) => {
      return b.idComments.length - a.idComments.length;
    }).slice(0, EXTRA_MOCK_FILMS_QUANTITY);
  }

  _getTopRatedFilms() {
    return this._films.sort((a, b) => {
      return b.rating - a.rating;
    }).slice(0, EXTRA_MOCK_FILMS_QUANTITY);
  }

  _renderFilms() {
    const filmsElement = this._filmsComponent.getElement();
    if (!this._films || this._films.length === 0) {
      render(filmsElement, this._filmsEmptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(filmsElement, this._filmsListComponent, RenderPosition.BEFOREEND);

    const iterator = this._getNextRenderCardIterator(this._films);
    const {value: filmsPart} = iterator.next();
    this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

    if (this._films.length > FILMS_PER_STEP) {
      this._renderShowMoreButton(iterator);
    }

    // дополнительные секции
    render(filmsElement, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    render(filmsElement, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    // секция Top rated
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), this._getTopRatedFilms());

    // секция Most commented
    this._renderFilmCards(this._mostCommentedFilmsListComponent.getContainer(), this._getMostCommentedFilms());
  }
}
