import dayjs from 'dayjs';
import he from 'he';
import SmartView from './smart';

const createFilmDetailsCommentTemplate = (comment) => {
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
        <button class="film-details__comment-delete" data-id="${id} ${isDisabled ? 'disabled' : ''}">${isDisabled ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`;
};

const createFilmDetailsNewCommentTemplate = (data) => {
  const { checkedEmotion, isDisabled } = data;

  return `<div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${checkedEmotion ? `<img src="images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji-${checkedEmotion}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${isDisabled ? 'disabled' : ''}></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>`;
};

export default class FilmDetailsNewComment extends SmartView {
  constructor(comment) {
    super();
    this._data = FilmDetailsNewComment.parseToData(comment);

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._checkedEmotion = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsNewCommentTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setAddCommentHandler(this._callback.addComment);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emotionChangeHandler);
  }

  _onEmotionChange(emotion) {
    this.updateData({
      checkedEmotion: emotion,
    });
  }

  _emotionChangeHandler(evt) {
    if (evt.target.matches('input[type="radio"]')) {
      this._onEmotionChange(evt.target.value);
    }
  }

  _addCommentHandler(evt) {
    if (evt.key === 'Enter' && evt.ctrlKey || evt.key === 'Enter' && evt.metaKey) {
      evt.preventDefault();
      const newCommentText = this.getElement().querySelector('.film-details__comment-input').value;
      this._callback.addComment(this._data.checkedEmotion, newCommentText);
    }
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().addEventListener('keydown', this._addCommentHandler);
  }

  static parseToData(comment) {
    return Object.assign(
      {},
      comment,
      {
        checkedEmotion: null,
        isDisabled: false,
      },
    );
  }
}
