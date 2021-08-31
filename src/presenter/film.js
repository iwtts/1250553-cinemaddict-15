import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import FilmDetailsCommentView from '../view/film-details-comment';
import {render, remove, replace} from '../utils/render';
import {isEscEvent} from '../utils/common';

export default class Film {
  constructor(filmContainer, changeData) {
    this._body = document.querySelector('body');
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmClick = this._handleFilmClick.bind(this);
    this._handleFilmDetailsCloseClick = this._handleFilmDetailsCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handletoWatchListClick = this._handletoWatchListClick.bind(this);
    this._handlemarkAsWatchedClick = this._handlemarkAsWatchedClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._comments = film.comments;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);
    this._filmDetailsCommentsList = this._filmDetailsComponent.getElement().querySelector('.film-details__comments-list');

    this._filmCardComponent.setClickHandler(this._handleFilmClick);
    this._filmDetailsComponent.setClickHandler(this._handleFilmDetailsCloseClick);

    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setToWatchListClickHandler(this._handletoWatchListClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handlemarkAsWatchedClick);

    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setToWatchListClickHandler(this._handletoWatchListClick);
    this._filmDetailsComponent.setMarkAsWatchedClickHandler(this._handlemarkAsWatchedClick);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmContainer.getElement().contains(prevFilmDetailsComponent.getElement())) {
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
    if (this._body.lastElementChild.className === 'film-details') {
      this._body.lastElementChild.remove();
    }

    this._body.appendChild(this._filmDetailsComponent.getElement());
    this._body.classList.add('hide-overflow');

    document.addEventListener('keydown',  this._escKeyDownHandler);

    this._comments.forEach((comment) => {
      render(this._filmDetailsCommentsList, new FilmDetailsCommentView(comment));
    });
  }

  _closeFilmDetails() {
    this._body.removeChild(this._filmDetailsComponent.getElement());
    this._body.classList.remove('hide-overflow');

    document.removeEventListener('keydown',  this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleFilmClick() {
    this._openFilmDetails();
  }

  _handleFilmDetailsCloseClick() {
    this._closeFilmDetails();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _handletoWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isInWatchlist: !this._film.isInWatchlist,
        },
      ),
    );
  }

  _handlemarkAsWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAlreadyWatched: !this._film.isAlreadyWatched,
        },
      ),
    );
  }
}
