import dayjs from 'dayjs';
import he from 'he';

import SmartView from './smart';

import { getFilmRuntime, getReleaseDate } from './utils';

const createCommentTemplate = (comment) => {
  const {id, emotion, date, text, author, isDisabled} = comment;

  const commentDate = dayjs(date).format('YYYY/MM/DD HH:mm');

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete" data-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDisabled ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`;
};

const createPopupTemplate = (data) => {
  const {poster, ageRating, title, alternativeTitle, totalRating, director, writers, actors, releaseDate, runtime, releaseCountry, genres, description, isInWatchList, isAlreadyWatched, isFavorite, comments} = data;

  const defineButtonActiveState = (condition) => {
    if (condition) {
      return 'film-details__control-button--active';
    }
  };

  const genresHeading = genres.length > 1 ? 'Genres' : 'Genre';

  const commentsListTemplate = comments
    .slice()
    .map((comment) => createCommentTemplate(comment))
    .join('');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title} poster">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getReleaseDate(releaseDate, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFilmRuntime(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresHeading}</td>
                <td class="film-details__cell">${genres.join(', ')}</td>
              </tr>
            </table>
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${defineButtonActiveState(isInWatchList)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${defineButtonActiveState(isAlreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${defineButtonActiveState(isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">${commentsListTemplate}</ul>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
  constructor(film, comments) {
    super();
    this._data = Popup.parseFilmToData(film, comments);

    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._markAsFavouriteClickHandler = this._markAsFavouriteClickHandler.bind(this);

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);

    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers() {
    this.setAddToWatchListClickHandler(this._callback.addToWatchListClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setMarkAsFavouriteClickHandler(this._callback.markAsFavouriteClick);

    this.setClosePopupClickHandler(this._callback.closePopupClick);

    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._addToWatchListClickHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._markAsWatchedClickHandler);
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._markAsFavouriteClickHandler);
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _markAsWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  }

  _markAsFavouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.markAsFavouriteClick();
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupClick();
  }

  _deleteCommentClickHandler(evt) {
    if (evt.target.matches('.film-details__comment-delete')){
      this._callback.deleteCommentClick(evt.target.dataset.id);
    }
  }

  setDeletingCommentState(id) {
    this.updateData({
      comments: this._data.comments.map((comment) => {
        if (comment.id === id) {
          comment.isDisabled = true;
        }
        return comment;
      }),
    });
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;

    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchListClickHandler);
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback.markAsWatchedClick = callback;

    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._markAsWatchedClickHandler);
  }

  setMarkAsFavouriteClickHandler(callback) {
    this._callback.markAsFavouriteClick = callback;

    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._markAsFavouriteClickHandler);
  }

  setClosePopupClickHandler(callback) {
    this._callback.closePopupClick = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement().addEventListener('click', this._deleteCommentClickHandler);
  }

  static parseFilmToData(film, comments) {
    return Object.assign(
      {},
      film,
      {
        comments: comments.map((comment) => Object.assign(
          {},
          comment,
          {
            isDisabled: false,
          },
        )),
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data.film);
    return data;
  }
}
