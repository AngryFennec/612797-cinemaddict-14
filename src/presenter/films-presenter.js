import FilmsList from '../view/films-list';
import {render, RenderPosition, replace} from '../utils/render';
import Films from '../view/films';
import FilmsListExtra from '../view/films-list-extra';
import FilmsEmptyList from '../view/films-empty-list';
import ShowMoreBtn from '../view/show-more-btn';
import FilmCardPresenter from './film-card-presenter';
import {
  getMostCommentedFilms,
  getNextRenderCardIterator,
  getTopRatedFilms,
  sortByDate,
  sortById,
  sortByRating
} from '../utils/presenter';
import Sort from '../view/sort';

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const FILMS_PER_STEP = 5;

export default class FilmsPresenter {
  constructor(container) {
    this._filmsContainer = container;
    this._films = null;
    this._filmsComponent = new Films();
    this._filmsListComponent = null;
    this._sortComponent = new Sort();
    this._mostCommentedFilmsListComponent = new FilmsListExtra(MOST_COMMENTED_TITLE);
    this._topRatedFilmsListComponent = new FilmsListExtra(TOP_RATED_TITLE);
    this._filmsEmptyListComponent = new FilmsEmptyList();
    this._showMoreButtonComponent = new ShowMoreBtn();
    this._sortFilms = this._sortFilms.bind(this);
  }

  init(films) {
    //сортировка
    render(this._filmsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setClickHandler(this._sortFilms);
    this._films = films.slice(); // копируем в презентер массив фильмов
    this._initFilms();
  }

  _initFilms() {

    render(this._filmsContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderFilms();

    // дополнительные секции
    render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);

    render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    // секция Top rated
    this._renderFilmCards(this._topRatedFilmsListComponent.getContainer(), getTopRatedFilms(this._films.slice()));

    // секция Most commented
    this._renderFilmCards(this._mostCommentedFilmsListComponent.getContainer(), getMostCommentedFilms(this._films.slice()));
  }

  _renderFilmCards(container, films) {
    for (let i = 0; i < films.length; i++) {
      const filmCardPresenter = new FilmCardPresenter(films[i], container);
      filmCardPresenter.init();
    }
  }

  _renderShowMoreButton(iterator) {
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const {value: filmsPart, done} = iterator.next();
      this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

      if (done) {
        this._showMoreButtonComponent.removeElement();
      }
    });
  }

  _renderFilms() {
    const filmsElement = this._filmsComponent.getElement();
    if (!this._films || this._films.length === 0) {
      render(filmsElement, this._filmsEmptyListComponent, RenderPosition.BEFOREEND);
      return;
    }
    const newFilmsListInstance = new FilmsList();
    if (this._filmsListComponent) {
      replace(newFilmsListInstance, this._filmsListComponent);
    } else {
      render(filmsElement, newFilmsListInstance, RenderPosition.AFTERBEGIN);
    }

    this._filmsListComponent = newFilmsListInstance;


    const iterator = getNextRenderCardIterator(this._films, FILMS_PER_STEP);
    const {value: filmsPart} = iterator.next();
    this._renderFilmCards(this._filmsListComponent.getContainer(), filmsPart);

    if (this._films.length > FILMS_PER_STEP) {
      this._renderShowMoreButton(iterator);
    }
  }

  // эта функция оставлена в классе, потому что она передается как коллбэк и в ней дергается метод класса
  _sortFilms(sortType) {
    switch (sortType) {
      case 'default':
        this._films.sort(sortById);
        break;
      case 'date':
        this._films.sort(sortByDate);
        break;
      case 'rating':
        this._films.sort(sortByRating);
        break;
    }
    this._renderFilms();
  }
}
