import dayjs from 'dayjs';
import AbstractView from './abstract';

const createFilmDetailsCommentTemplate = (comment) => {
  const {emotion, date, text, author} = comment;

  const commentDate = dayjs(date).format('YYYY/MM/DD HH:mm');

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class FilmDetailsComment extends AbstractView {
  constructor(comment) {
    super();
    this.comment = comment;
  }

  getTemplate() {
    return createFilmDetailsCommentTemplate(this.comment);
  }
}
