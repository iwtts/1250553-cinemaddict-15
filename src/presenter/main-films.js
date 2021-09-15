import MainSortView from '../view/main-sort.js';
import MainFilmsSectionView from '../view/main-films.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCardPresenter from './film-card.js';

import { filter } from '../utils/filter.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByDate, sortByRating } from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MainFilmsSection {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._bodyElement =  document.querySelector('body');
    this._filmCardPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._mainSortComponent = null;
    this._showMoreButtonComponent = null;
    this._filmsListEmptyComponent = null;

    this._mainFilmsSectionComponent = new MainFilmsSectionView();
    this._filmsListComponent = new FilmsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._container, this._mainFilmsSectionComponent);
    this._renderMainFilmsSection();
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearMainFilmsSection();
        this._renderMainFilmsSection();
        break;
      case UpdateType.MAJOR:
        this._clearMainFilmsSection({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderMainFilmsSection();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainFilmsSection();
    this._renderMainFilmsSection();
  }

  _renderMainSort() {
    if (this._mainSortComponent !== null) {
      this._mainSortComponent = null;
    }

    this._mainSortComponent = new MainSortView(this._currentSortType);
    this._mainSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._mainFilmsSectionComponent, this._mainSortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._filmsListContainerElement, this._handleViewAction);
    filmCardPresenter.init(film);
    this._filmCardPresenter.set(film.id, filmCardPresenter);
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderFilmsListEmpty() {
    this._filmsListEmptyComponent = new FilmsListEmptyView(this._filterType);
    render(this._mainFilmsSectionComponent, this._filmsListEmptyComponent);
  }

  _renderFilmsList() {
    render(this._mainFilmsSectionComponent, this._filmsListComponent);
    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
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
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _clearMainFilmsSection({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();

    remove(this._mainSortComponent);
    remove(this._showMoreButtonComponent);

    if (this._filmsListEmptyComponent) {
      remove(this._filmsListEmptyComponent);
    }

    if (resetRenderedFilmCardsCount) {
      this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmCardsCount = Math.min(filmsCount, this._renderedFilmCardsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMainFilmsSection() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderFilmsListEmpty();
      return;
    }

    this._renderMainSort();
    this._renderFilmsList();
    this._renderFilmCards(films.slice(0, Math.min(filmsCount, this._renderedFilmCardsCount)));

    if (filmsCount > this._renderedFilmCardsCount) {
      this._renderShowMoreButton();
    }
  }
}

