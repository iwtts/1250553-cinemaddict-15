import AbstractView from './abstract';

import { renderGenres, getRuntime, getReleaseDate } from './utils';
import { MAX_DESCRIPTION_LENGTH } from './const';

const createFilmCardTemplate = (film) => {
  const {title, totalRating, releaseDate, runtime, genres, poster, description, comments, isInWatchList, isAlreadyWatched, isFavorite} = film;

  const defineButtonActiveState = (condition) => (condition) ? 'film-card__controls-item--active' : '';

  const getFilmCardDescription = () => (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`: description;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getReleaseDate(releaseDate, 'YYYY')}</span>
      <span class="film-card__duration">${getRuntime(runtime)}</span>
      ${renderGenres(genres, 'card')}
    </p>
    <img src="${poster}" alt="${title} poster" class="film-card__poster">
    <p class="film-card__description">${getFilmCardDescription()}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${defineButtonActiveState(isInWatchList)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${defineButtonActiveState(isAlreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${defineButtonActiveState(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);

    this._openFilmDetailsClickHandler = this._openFilmDetailsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _markAsWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback._markAsWatchedClick();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback._favouriteClick();
  }

  _openFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.openFilmDetailsClick();
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;

    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addToWatchListClickHandler);
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback._markAsWatchedClick = callback;

    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._markAsWatchedClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback._favouriteClick = callback;

    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favouriteClickHandler);
  }

  setOpenFilmDetailsClickHandler(callback) {
    this._callback.openFilmDetailsClick = callback;

    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openFilmDetailsClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openFilmDetailsClickHandler);
  }
}
