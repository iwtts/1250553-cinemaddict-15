import MainSortView from '../view/main-sort.js';
import MainFilmsSectionView from '../view/main-films.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCardPresenter from './film-card.js';

import { updateItem } from '../utils/common.js';
import { render, remove } from '../utils/render.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MainFilmsSection {
  constructor(container) {
    this._container = container;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._bodyElement =  document.querySelector('body');
    this._filmCardPresenter = new Map();

    this._mainSortComponent = new MainSortView();
    this._mainFilmsSectionComponent = new MainFilmsSectionView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(mainSectionFilms) {
    this._mainSectionFilms = mainSectionFilms.slice();

    this._renderMainSort();
    render(this._container, this._mainFilmsSectionComponent);

    this._renderMainFilmsSection();
  }

  _handleFilmChange(updatedFilm) {
    this._mainSectionFilms = updateItem(this._mainSectionFilms, updatedFilm);
    this._filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _renderMainSort() {
    render(this._container, this._mainSortComponent);
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._filmsListContainerElement, this._handleFilmChange);
    filmCardPresenter.init(film);
    this._filmCardPresenter.set(film.id, filmCardPresenter);
  }

  _renderFilmCards(from, to) {
    this._mainSectionFilms
      .slice(from, to)
      .forEach((mainSectionFilm) => this._renderFilmCard(mainSectionFilm));
  }

  _clearFilmsList() {
    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmsListEmpty() {
    render(this._mainFilmsSectionComponent, this._filmsListEmptyComponent);
  }

  _renderFilmsList() {
    render(this._mainFilmsSectionComponent, this._filmsListComponent);
    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');

    this._renderFilmCards(0, Math.min(this._mainSectionFilms.length, FILMS_COUNT_PER_STEP));

    if (this._mainSectionFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmCardsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCardsCount >= this._mainSectionFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMainFilmsSection() {
    if (this._mainSectionFilms.length === 0) {
      remove(this._mainSortComponent);
      this._renderFilmsListEmpty();
      return;
    }

    this._renderFilmsList();
  }
}

