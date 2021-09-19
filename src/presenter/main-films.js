import MainSortView from '../view/main-sort';
import MainFilmsView from '../view/main-films';
import FilmsListEmptyView from '../view/films-list-empty';
import FilmsListView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import LoadingView from '../view/loading.js';
import FilmCardPresenter from './film-card';

import { filter } from '../utils/filter';
import { RenderPosition, render, remove } from '../utils/render';
import { SortType, UpdateType, UserAction, FilterType } from '../const';
import { sortByDate, sortByRating } from '../utils/common';

const FILMS_COUNT_PER_STEP = 5;

export default class MainFilms {
  constructor(container, filmsModel, filterModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._bodyElement =  document.querySelector('body');
    this._filmCardPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._mainSortComponent = null;
    this._showMoreButtonComponent = null;
    this._filmsListEmptyComponent = null;

    this._mainFilmsComponent = new MainFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._container, this._mainFilmsComponent);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderMainFilms();
  }

  destroy() {
    this._clearMainFilms({resetRenderedFilmCardsCount: true, resetSortType: true});

    remove(this._mainFilmsComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
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
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
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
        this._clearMainFilms();
        this._renderMainFilms();
        break;
      case UpdateType.MAJOR:
        this._clearMainFilms({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderMainFilms();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMainFilms();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainFilms();
    this._renderMainFilms();
  }

  _renderMainSort() {
    if (this._mainSortComponent !== null) {
      this._mainSortComponent = null;
    }

    this._mainSortComponent = new MainSortView(this._currentSortType);
    this._mainSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._mainFilmsComponent, this._mainSortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._filmsListContainerElement, this._handleViewAction);
    filmCardPresenter.init(film);
    this._filmCardPresenter.set(film.id, filmCardPresenter);
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderLoading() {
    render(this._mainFilmsComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsListEmpty() {
    this._filmsListEmptyComponent = new FilmsListEmptyView(this._filterType);
    render(this._mainFilmsComponent, this._filmsListEmptyComponent);
  }

  _renderFilmsList() {
    render(this._mainFilmsComponent, this._filmsListComponent);
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

  _clearMainFilms({resetRenderedFilmCardsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();

    remove(this._loadingComponent);
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

  _renderMainFilms() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

