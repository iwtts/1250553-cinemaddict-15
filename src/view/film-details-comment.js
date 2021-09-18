import dayjs from 'dayjs';
import he from 'he';

import AbstractView from './abstract';

const createFilmDetailsCommentTemplate = (comment) => {
  const {id, emotion, date, text, author} = comment;

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
        <button class="film-details__comment-delete" data-id="${id}">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class FilmDetailsComment extends AbstractView {
  constructor(comment) {
    super();
    this.comment = comment;

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsCommentTemplate(this.comment);
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentDeleteClick(evt.target.dataset.id);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteClickHandler);
  }
}
