import CardView from '../view/card';
import PopupView from '../view/popup';
import PopupNewCommentView from '../view/popup-new-comment';

import { render, replace, remove } from '../utils/render';
import { UserAction, UpdateType } from '../const.js';

export const State = {
  DEFAULT: 'DEFAULT',
  DELETING: 'DELETING',
  SAVING: 'SAVING',
  ABORTING: 'ABORTING',
};


export default class Card {
  constructor(container, changeData, api) {
    this._container = container;
    this._changeData = changeData;
    this._api = api;

    this._bodyElement =  document.querySelector('body');

    this._cardComponent = null;
    this._popupComponent = null;
    this._comments = [];

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleMarkAsFavouriteClick = this._handleMarkAsFavouriteClick.bind(this);

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;
    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(film);
    this._popupNewCommentComponent = new PopupNewCommentView(this._film);


    this._cardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._cardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._cardComponent.setMarkAsFavouriteClickHandler(this._handleMarkAsFavouriteClick);
    this._cardComponent.setOpenPopupClickHandler(this._handleOpenPopupClick);


    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this._container, this._cardComponent);
      return;
    }

    if (this._container.contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._bodyElement.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevCardComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
  }

  setViewState(state) {
    if (state === State.DEFAULT) {
      return;
    }

    switch (state) {
      case State.SAVING:
        this._popupNewCommentComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._popupComponent.updateData({
          comments: this._comments.map((comment) => Object.assign(
            {},
            comment,
            {
              isDisabled: true,
            },
          )),
        });
        break;
      case State.ABORTING:
        this._cardComponent.shake(this._resetPopupState);
        this._popupComponent.shake(this._resetPopupState);
        break;
    }
  }

  _resetPopupNewCommentState() {
    this._popupNewCommentComponent.updateData(
      {
        isDisabled: false,
      },
    );
  }

  _resetPopupState() {
    this._popupComponent.updateData({
      comments: this.comments.map((comment) => Object.assign(
        comment,
        {
          isDisabled: false,
        },
      )),
    });
  }

  _openPopup() {
    this._api.getComments(this._film.id)
      .then((comments) => {
        this._comments = comments.slice();
        this._popupComponent = new PopupView(this._film, this._comments);

        this._popupComponent.setClosePopupClickHandler(this._handleClosePopupClick);
        this._popupComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
        this._popupComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
        this._popupComponent.setMarkAsFavouriteClickHandler(this._handleMarkAsFavouriteClick);

        this._popupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

        if (this._bodyElement.lastElementChild.className === 'film-details') {
          this._bodyElement.lastElementChild.remove();
        }

        const popupCommentsWrap = this._popupComponent.getElement().querySelector('.film-details__comments-wrap');
        render(popupCommentsWrap, this._popupNewCommentComponent);
        this._popupNewCommentComponent.setAddCommentHandler(this._handleAddComment);

        this._bodyElement.appendChild(this._popupComponent.getElement());
        this._bodyElement.classList.add('hide-overflow');

        document.addEventListener('keydown', this._escKeyDownHandler);
      });
  }

  _closePopup() {
    this._bodyElement.removeChild(this._popupComponent.getElement());
    this._bodyElement.classList.remove('hide-overflow');

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleOpenPopupClick() {
    this._openPopup();
  }

  _handleClosePopupClick() {
    this._closePopup();
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

  _handleMarkAsFavouriteClick() {
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

  _handleDeleteCommentClick(id) {
    this._popupComponent.setDeletingCommentState(id, true);
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
      })
      .catch(() => {
        this._popupComponent.shake(this._resetPopupState);
      });
  }

  _handleAddComment(newCommentEmotion, newCommentText) {
    this._popupNewCommentComponent.setAddingCommentState(true);
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
    })
      .catch(() => {
        this._popupNewCommentComponent.shake(this._resetPopupNewCommentState);
      });
  }
}
