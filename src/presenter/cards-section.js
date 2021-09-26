import SortView from '../view/sort';
import CardsSectionView from '../view/cards-section';
import CardsListEmptyView from '../view/cards-list-empty';
import CardsListView from '../view/cards-list';
import ShowMoreButtonView from '../view/show-more-button';
import LoadingView from '../view/loading.js';
import CardPresenter from './card';

import { filter } from '../utils/filter';
import { RenderPosition, render, remove } from '../utils/render';
import { SortType, UpdateType, UserAction, FilterType } from '../const';
import { sortByDate, sortByRating } from '../utils/common';

const CARDS_COUNT_PER_STEP = 5;

export default class CardsSection {
  constructor(container, filmsModel, filtersModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._bodyElement =  document.querySelector('body');
    this._cardPresenters = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._openedFilmId = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._cardsListEmptyComponent = null;

    this._cardsSectionComponent = new CardsSectionView();
    this._cardsListComponent = new CardsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._container, this._cardsSectionComponent);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._renderCardsSection();
  }

  destroy() {
    this._clearCardsSection({resetRenderedCardsCount: true, resetSortType: true});

    remove(this._cardsSectionComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    if (this._filterType !== FilterType.STATS) {
      this._filterType = this._filtersModel.getFilter();
    }

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

  _initPopup(presenters, filmId) {
    if (presenters.has(filmId)) {
      presenters.get(filmId).closePopup();
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._cardsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderCard(film) {
    const cardPresenter = new CardPresenter(this._cardsListContainerElement, this._handleViewAction, () => this._handleOpenPopup(film.id), () => this._handleClosePopup(), this._api);
    cardPresenter.init(film);
    this._cardPresenters.set(film.id, cardPresenter);
  }

  _renderCards(films) {
    films.forEach((film) => this._renderCard(film));
  }

  _renderLoading() {
    render(this._cardsSectionComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCardsListEmpty() {
    this._cardsListEmptyComponent = new CardsListEmptyView(this._filterType);
    render(this._cardsSectionComponent, this._cardsListEmptyComponent);
  }

  _renderCardsList() {
    render(this._cardsSectionComponent, this._cardsListComponent);
    this._cardsListContainerElement = this._cardsListComponent.getElement().querySelector('.films-list__container');
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._cardsListComponent, this._showMoreButtonComponent);
  }

  _renderCardsSection() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderCardsListEmpty();
      return;
    }

    this._renderSort();
    this._renderCardsList();
    this._renderCards(films.slice(0, Math.min(filmsCount, this._renderedCardsCount)));

    if (filmsCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderPopup() {
    if (!this._openedFilmId) {
      return;
    }
    const presenter = this._cardPresenters.get(this._openedFilmId);
    if (presenter) {
      presenter.openPopup();
    } else {
      this._openedFilmId = null;
      this._bodyElement.classList.remove('hide-overflow');
    }
  }

  _clearCardsSection({resetRenderedCardsCount: resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const openedCardPresenter = this._cardPresenters.get(this._openedFilmId);
    if (openedCardPresenter) {
      document.removeEventListener('keydown', openedCardPresenter.escKeyDownHandler);
    }

    const filmsCount = this._getFilms().length;

    this._cardPresenters.forEach((presenter) => presenter.destroy());
    this._cardPresenters.clear();

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (this._cardsListEmptyComponent) {
      remove(this._cardsListEmptyComponent);
    }

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedCardsCount = Math.min(filmsCount, this._renderedCardsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleOpenPopup(id) {
    const openedFilmId = this._openedFilmId;
    if (openedFilmId !== null) {
      this._initPopup(this._cardPresenters, openedFilmId);
    }
    this._openedFilmId = id;
  }

  _handleClosePopup() {
    this._openedFilmId = null;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
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
        this._cardPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearCardsSection();
        this._renderCardsSection();
        this._renderPopup();
        break;
      case UpdateType.MAJOR:
        this._clearCardsSection({resetRenderedCardsCount: true, resetSortType: true});
        this._renderCardsSection();
        this._renderPopup();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderCardsSection();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearCardsSection();
    this._renderCardsSection();
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedCardsCount = Math.min(filmsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedCardsCount, newRenderedCardsCount);

    this._renderCards(films);
    this._renderedCardsCount = newRenderedCardsCount;

    if (this._renderedCardsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }
}

