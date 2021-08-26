import FilmsListContainerView from '../view/films-list-container';
import FilmsListEmptyView from '../view/films-list-empty';
import FilmsListView from '../view/films-list';
import FilmsMostCommentedListView from '../view/films-most-commented-list';
import FilmsSectionView from '../view/films-section';
import FilmsTopRatedListView from '../view/films-top-rated-list';
import ShowMoreButtonView from '../view/show-more-button';
import SortView from '../view/sort';
import FilmPresenter from './film';
import {render, remove} from '../utils/render.js';
import {sortByComments, sortByRating} from '../utils/sort';
import {updateItem} from '../utils/common';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = new Map();

    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsMostCommentedListComponent = new FilmsMostCommentedListView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsTopRatedListComponent = new FilmsTopRatedListView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films;

    render(this._filmsContainer, this._filmsSectionComponent);

    this._renderFilms();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderSort() {
    render(this._filmsSectionComponent, this._sortComponent);
  }

  _renderFilmsList() {

    render(this._filmsSectionComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderFilmCards(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmCard(film, place = this._filmsListContainerComponent) {
    const filmPresenter = new FilmPresenter(place, this._handleFilmChange);
    filmPresenter.init(film);

    this._filmPresenter.set(film.id, filmPresenter);
  }

  _clearFilmsList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderFilmListEmpty() {
    render(this._filmsSectionComponent, this._filmsListEmptyComponent);
  }

  _renderShowMoreButton() {
    render(this._filmsSectionComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsMostCommentedList() {
    this._filmsMostCommentedListContainerComponent = new FilmsListContainerView();

    render(this._filmsSectionComponent, this._filmsMostCommentedListComponent);
    render(this._filmsMostCommentedListComponent, this._filmsMostCommentedListContainerComponent);

    this._films.sort(sortByComments)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, this._filmsMostCommentedListContainerComponent));
  }

  _renderFilmsTopRatedList() {
    this._filmsTopRatedListContainerComponent = new FilmsListContainerView();

    render(this._filmsSectionComponent, this._filmsTopRatedListComponent);
    render(this._filmsTopRatedListComponent, this._filmsTopRatedListContainerComponent);

    this._films.sort(sortByRating)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, this._filmsTopRatedListContainerComponent));
  }

  _renderFilms() {
    if (this._films.length === 0) {
      this._renderFilmListEmpty();
      return;
    }

    this._renderSort();
    this._renderFilmsList();
    this._renderFilmsTopRatedList();
    this._renderFilmsMostCommentedList();
  }
}
