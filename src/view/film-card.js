import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {
    title,
    totalRating,
    releaseDate,runtime,
    genre,
    poster,
    description,
    comments,
    isAlreadyWatched,
    isInWatchlist,
    isFavorite,
  } = film;

  const year = dayjs(releaseDate).format('YYYY');

  const addToWathclistBtnClassName = isInWatchlist
    ? 'film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--add-to-watchlist';

  const markAsWatchedBtnClassName = isAlreadyWatched
    ? 'film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--mark-as-watched';

  const favouriteBtnClassName = isFavorite
    ? 'film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--favorite';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genre.join(', ')}</span>
    </p>
    <img src="./${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="${addToWathclistBtnClassName}" type="button">Add to watchlist</button>
      <button class="${markAsWatchedBtnClassName}" type="button">Mark as watched</button>
      <button class="${favouriteBtnClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(film) {
    this._card = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}