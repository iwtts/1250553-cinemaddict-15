import dayjs from 'dayjs';

export const createFilmDetailsCommentTemplate = (comment) => {
  const {
    emotion,
    date,
    text,
    author,
  } = comment;

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
