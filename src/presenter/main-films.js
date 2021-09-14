import MainSortView from '../view/main-sort.js';
import MainFilmsSectionView from '../view/main-films.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCardPresenter from './film-card.js';

import { render, remove } from '../utils/render.js';
import { SortType } from '../const.js';
import { sortByDate, sortByRating } from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MainFilmsSection {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._bodyElement =  document.querySelector('body');
    this._filmCardPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._mainSortComponent = new MainSortView();
    this._mainFilmsSectionComponent = new MainFilmsSectionView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderMainSort();

    render(this._container, this._mainFilmsSectionComponent);
    this._renderMainFilmsSection();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortByRating);
    }

    return this._filmsModel.getFilms();
  }

  _handleFilmChange(updatedFilm) {
    this._filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderMainSort() {
    render(this._container, this._mainSortComponent);
    this._mainSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._filmsListContainerElement, this._handleFilmChange);
    filmCardPresenter.init(film);
    this._filmCardPresenter.set(film.id, filmCardPresenter);
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
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

    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

    this._renderFilmCards(films);

    if (filmsCount > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCardsCount = Math.min(filmsCount, this._renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCardsCount, newRenderedFilmCardsCount);

    this._renderFilmCards(films);
    this._renderedFilmCardsCount = newRenderedFilmCardsCount;

    if (this._renderedFilmCardsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMainFilmsSection() {
    if (this._getFilms().length === 0) {
      remove(this._mainSortComponent);
      this._renderFilmsListEmpty();
      return;
    }

    this._renderFilmsList();
  }
}

