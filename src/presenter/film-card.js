import FilmCardView from '../view/film-card';
import FilmDetailsPopupView from '../view/film-details';
import FilmDetailsCommentView from '../view/film-details-comment';
import FilmDetailsNewCommentView from '../view/film-details-new-comment';

import { render, replace, remove } from '../utils/render';
import { UserAction, UpdateType } from '../const.js';

export default class FilmCard {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._bodyElement =  document.querySelector('body');

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsPopupView(film);

    const filmDetailsCommentWrap = this._filmDetailsComponent.getElement().querySelector('.film-details__comments-wrap');
    const filmDetailsCommentsList = this._filmDetailsComponent.getElement().querySelector('.film-details__comments-list');

    for (let i = 0; i < this._film.comments.length; i++) {
      render(filmDetailsCommentsList, new FilmDetailsCommentView(this._film.comments[i]));
    }

    render(filmDetailsCommentWrap, new FilmDetailsNewCommentView);

    this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCardComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetailsClick);

    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
    this._filmDetailsComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmDetailsComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmDetailsComponent.setFavouriteClickHandler(this._handleFavouriteClick);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._container, this._filmCardComponent);
      return;
    }

    if (this._container.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._bodyElement.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  _openFilmDetails() {
    if (this._bodyElement.lastElementChild.className === 'film-details') {
      this._bodyElement.lastElementChild.remove();
    }

    this._bodyElement.appendChild(this._filmDetailsComponent.getElement());
    this._bodyElement.classList.add('hide-overflow');

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _closeFilmDetails() {
    this._bodyElement.removeChild(this._filmDetailsComponent.getElement());
    this._bodyElement.classList.remove('hide-overflow');

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleOpenFilmDetailsClick() {
    this._openFilmDetails();
  }

  _handleCloseFilmDetailsClick() {
    this._closeFilmDetails();
  }

  _handleAddToWatchListClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isInWatchList: !this._film.isInWatchList,
        },
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isAlreadyWatched: !this._film.isAlreadyWatched,
        },
      ),
    );
  }

  _handleFavouriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }
}

