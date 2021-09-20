import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';

import { render, replace, remove } from '../utils/render';
import { UserAction, UpdateType } from '../const.js';

export const State = {
  DEFAULT: 'DEFAULT',
  DELETING: 'DELETING',
  SAVING: 'SAVING',
};


export default class FilmCard {
  constructor(container, changeData, api) {
    this._container = container;
    this._changeData = changeData;
    this._api = api;

    this._bodyElement =  document.querySelector('body');

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._comments = [];

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);

    this._handleOpenFilmDetailsClick = this._handleOpenFilmDetailsClick.bind(this);
    this._handleCloseFilmDetailsClick = this._handleCloseFilmDetailsClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);

    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(this._film, this._comments);

    this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCardComponent.setOpenFilmDetailsClickHandler(this._handleOpenFilmDetailsClick);

    this._filmDetailsComponent.setCloseFilmDetailsClickHandler(this._handleCloseFilmDetailsClick);
    this._filmDetailsComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmDetailsComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmDetailsComponent.setFavouriteClickHandler(this._handleFavouriteClick);

    this._filmDetailsComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
    this._filmDetailsComponent.setAddCommentHandler(this._handleAddComment);


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

  setViewState(state) {
    if (state === State.DEFAULT) {
      return;
    }

    switch (state) {
      case State.SAVING:
        this._filmDetailsComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._filmDetailsComponent.updateData({
          comments: this._comments.map((comment) => Object.assign(
            {},
            comment,
            {
              isDisabled: true,
            },
          )),
        });
        break;
    }
  }

  _openFilmDetails() {
    const initFilmdDetails = (comments) => {
      this._comments = comments.slice();
      if (this._bodyElement.lastElementChild.className === 'film-details') {
        this._bodyElement.lastElementChild.remove();
      }
      this._bodyElement.appendChild(this._filmDetailsComponent.getElement());
      this._bodyElement.classList.add('hide-overflow');

      document.addEventListener('keydown', this._escKeyDownHandler);
    };

    this._api.getComments(this._film.id)
      .then((comments) => {
        initFilmdDetails(comments);
      });
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

  _handleCommentDeleteClick(id) {
    this._api.deleteComment(id)
      .then(() => {
        this._comments = this._comments.filter((comment) => comment.id !== id.toString());
        this._changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            {
              comments: this._film.comments.filter((commentId) => commentId !== id),
            },
          ));
      });
  }

  _handleAddComment(newCommentEmotion, newCommentText) {
    this._api.addComment(this._film.id, {
      text: newCommentText,
      emotion: newCommentEmotion,
    }).then((data) => {
      this._comments = data.comments.slice();
      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        data.film,
      );
    });
  }
}
