import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details-popup';
import FilmDetailsCommentView from '../view/film-details-popup-comment';
import FilmsListContainerView from '../view/films-list-container';
import FilmsListEmptyView from '../view/films-list-empty';
import FilmsListView from '../view/films-list';
import FilmsMostCommentedListView from '../view/films-most-commented-list';
import FilmsSectionView from '../view/films-section';
import FilmsTopRatedListView from '../view/films-top-rated-list';
import ShowMoreButtonView from '../view/show-more-button';
import SortView from '../view/sort';
import {render} from '../utils/render.js';

const FILMS_COUNT_PER_STEP = 5;

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListComponent = new FilmsListView();
    this._filmsMostCommentedListComponent = new FilmsMostCommentedListView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsTopRatedListComponent = new FilmsTopRatedListView();
    this._sortComponent = new SortView();
  }

  init(films) {
    this._films = films;

    render(this._filmsContainer, this._filmsSectionComponent);

    this._renderFilms();
  }

  _renderSort() {
  }

  _renderFilmCard() {
  }

  _renderFilmCards(from, to) {
  }

  _renderFilmListEmpty() {
  }

  _renderShowMoreButton() {
  }

  _renderFilmsMostCommentedList() {
  }

  _renderFilmsTopRatedList() {
  }

  _renderFilms() {
    if (this._films.length === 0) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderSort();
    render(this._filmsContainer, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderFilmCards(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderFilmsTopRatedList();
    this._renderFilmsMostCommentedList();
  }
}
